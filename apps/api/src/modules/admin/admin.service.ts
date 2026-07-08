import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Order, OrderItem } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Branch } from '../branches/entities/branch.entity';
import { PlatformSetting } from './entities/platform-setting.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { SubscriptionPlan } from '../billing/entities/subscription-plan.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(PlatformSetting)
    private readonly settingRepository: Repository<PlatformSetting>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getDashboard() {
    const tenants = await this.tenantRepository.find();
    const totalTenants = tenants.length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalBranches, ordersToday, revenueResult] = await Promise.all([
      this.userRepository.count(),
      this.branchRepository.count(),
      this.orderRepository.count({
        where: { createdAt: MoreThanOrEqual(todayStart) },
      }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('COALESCE(SUM(order.total), 0)', 'total')
        .where('order.created_at >= :today', { today: todayStart })
        .getRawOne(),
    ]);

    const revenueTrend = await this.orderRepository
      .createQueryBuilder('order')
      .select('DATE(order.created_at) as date')
      .addSelect('COALESCE(SUM(order.total), 0)', 'revenue')
      .where('order.created_at >= :thirtyDays', { thirtyDays: thirtyDaysAgo })
      .groupBy('DATE(order.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const tenantSignups = await this.tenantRepository
      .createQueryBuilder('tenant')
      .select('DATE(tenant.created_at) as date')
      .addSelect('COUNT(*)', 'count')
      .where('tenant.created_at >= :thirtyDays', { thirtyDays: thirtyDaysAgo })
      .groupBy('DATE(tenant.created_at)')
      .orderBy('date', 'ASC')
      .getRawMany();

    const volumeRaw = await this.orderRepository
      .createQueryBuilder('o')
      .select('o.tenant_id', 'tenantId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('o.tenant_id')
      .getRawMany();
    const volumeMap = new Map(volumeRaw.map((r: any) => [r.tenantId, Number(r.count)]));
    const orderVolumeByTenant = tenants.map((t) => ({
      tenantId: t.id,
      tenantName: t.name,
      count: volumeMap.get(t.id) || 0,
    }));

    const recentOrders = await this.orderRepository.find({
      relations: ['tenant'],
      order: { createdAt: 'DESC' as any },
      take: 10,
    });

    return {
      totalTenants,
      activeUsers: totalUsers,
      totalBranches,
      totalOrdersToday: ordersToday,
      revenueToday: Number((revenueResult as any)?.total || 0),
      revenueTrend: revenueTrend.map((r: any) => ({
        date: r.date,
        revenue: Number(r.revenue),
      })),
      orderVolumeByTenant,
      tenantSignups: tenantSignups.map((s: any) => ({
        date: s.date,
        count: Number(s.count),
      })),
      recentActivity: recentOrders.map((o) => ({
        id: o.id,
        type: 'order',
        description: `Order #${o.id.slice(0, 8)} - ${o.status}`,
        tenantName: (o as any).tenant?.name || 'Unknown',
        timestamp: o.createdAt,
      })),
    };
  }

  async getTenantsSummary() {
    const tenants = await this.tenantRepository.find();

    const tenantIds = tenants.map((t) => t.id);

    const [branchCounts, userCounts, orderCounts, latestInvoices] = await Promise.all([
      this.branchRepository
        .createQueryBuilder('b')
        .select('b.tenant_id', 'tenantId')
        .addSelect('COUNT(*)', 'count')
        .where('b.tenant_id IN (:...ids)', { ids: tenantIds })
        .groupBy('b.tenant_id')
        .getRawMany(),
      this.userRepository
        .createQueryBuilder('u')
        .select('u.tenant_id', 'tenantId')
        .addSelect('COUNT(*)', 'count')
        .where('u.tenant_id IN (:...ids)', { ids: tenantIds })
        .groupBy('u.tenant_id')
        .getRawMany(),
      this.orderRepository
        .createQueryBuilder('o')
        .select('o.tenant_id', 'tenantId')
        .addSelect('COUNT(*)', 'count')
        .where('o.tenant_id IN (:...ids)', { ids: tenantIds })
        .groupBy('o.tenant_id')
        .getRawMany(),
      this.invoiceRepository
        .createQueryBuilder('inv')
        .leftJoinAndSelect('inv.plan', 'plan')
        .where((qb) => {
          const sub = qb
            .subQuery()
            .select('i2.id')
            .from(Invoice, 'i2')
            .where('i2.tenant_id = inv.tenant_id')
            .orderBy('i2.created_at', 'DESC')
            .limit(1)
            .getQuery();
          return 'inv.id = ' + sub;
        })
        .getMany(),
    ]);

    const branchMap = new Map(branchCounts.map((r: any) => [r.tenantId, Number(r.count)]));
    const userMap = new Map(userCounts.map((r: any) => [r.tenantId, Number(r.count)]));
    const orderMap = new Map(orderCounts.map((r: any) => [r.tenantId, Number(r.count)]));
    const invoiceMap = new Map(latestInvoices.map((inv) => [inv.tenantId, inv]));

    return tenants.map((t) => ({
      ...t,
      branchCount: branchMap.get(t.id) || 0,
      userCount: userMap.get(t.id) || 0,
      orderCount: orderMap.get(t.id) || 0,
      planName: (invoiceMap.get(t.id) as any)?.plan?.name || null,
      planId: (invoiceMap.get(t.id) as any)?.planId || null,
    }));
  }

  async getSettings() {
    const rows = await this.settingRepository.find();
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  async updateSetting(key: string, value: string) {
    const existing = await this.settingRepository.findOne({ where: { key } });
    if (existing) {
      existing.value = value;
      return this.settingRepository.save(existing);
    }
    return this.settingRepository.save({ key, value });
  }

  async resetPassword(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newPassword = Math.random().toString(36).slice(-8) + '1A';
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { newPassword };
  }

  async getGeographicDistribution(): Promise<{ city: string; count: number }[]> {
    const result = await this.branchRepository
      .createQueryBuilder('branch')
      .select('branch.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('branch.city IS NOT NULL')
      .groupBy('branch.city')
      .orderBy('count', 'DESC')
      .getRawMany();
    return result.map((r: any) => ({ city: r.city, count: Number(r.count) }));
  }

  async assignPlan(tenantId: string, planId: string) {
    const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');

    const invoice = this.invoiceRepository.create({
      tenantId,
      planId,
      amount: plan.price,
      status: 'active',
    });
    return this.invoiceRepository.save(invoice);
  }

  async getTenantMetrics(tenantId: string) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      revenueResult,
      activeUsers,
      activeBranches,
      ordersByDay,
      popularServices,
    ] = await Promise.all([
      this.orderRepository.count({ where: { tenantId } }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('COALESCE(SUM(order.total), 0)', 'total')
        .where('order.tenant_id = :tenantId', { tenantId })
        .getRawOne(),
      this.userRepository.count({ where: { tenantId, isActive: true } }),
      this.branchRepository.count({ where: { tenantId, isActive: true } }),
      this.orderRepository
        .createQueryBuilder('order')
        .select('DATE(order.created_at) as date')
        .addSelect('COUNT(*)', 'count')
        .addSelect('COALESCE(SUM(order.total), 0)', 'revenue')
        .where('order.tenant_id = :tenantId', { tenantId })
        .andWhere('order.created_at >= :thirtyDays', { thirtyDays: thirtyDaysAgo })
        .groupBy('DATE(order.created_at)')
        .orderBy('date', 'ASC')
        .getRawMany(),
      this.orderItemRepository
        .createQueryBuilder('item')
        .select('item.garment_type', 'garmentType')
        .addSelect('COUNT(*)', 'count')
        .innerJoin('item.order', 'o')
        .where('o.tenant_id = :tenantId', { tenantId })
        .groupBy('item.garment_type')
        .orderBy('count', 'DESC')
        .limit(5)
        .getRawMany(),
    ]);

    return {
      totalOrders,
      totalRevenue: Number((revenueResult as any)?.total || 0),
      activeUsers,
      activeBranches,
      ordersByDay: ordersByDay.map((r: any) => ({
        date: r.date,
        count: Number(r.count),
        revenue: Number(r.revenue),
      })),
      popularServices: popularServices.map((r: any) => ({
        garmentType: r.garmentType,
        count: Number(r.count),
      })),
    };
  }
}
