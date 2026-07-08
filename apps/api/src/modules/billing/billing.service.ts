import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async listPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({ where: { isActive: true } });
  }

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.planRepository.create(data);
    return this.planRepository.save(plan);
  }

  async updatePlan(id: string, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    await this.planRepository.update(id, data);
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async listInvoices(tenantId?: string): Promise<Invoice[]> {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    return this.invoiceRepository.find({
      where,
      relations: tenantId ? ['plan'] : ['tenant', 'plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async getRevenueRecognition() {
    const paidInvoices = await this.invoiceRepository.find({
      where: { status: 'paid' },
      relations: ['tenant', 'plan'],
    });

    const totalRecognized = paidInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

    const byMonthMap: Record<string, number> = {};
    const byTenantMap: Record<string, { name: string; amount: number }> = {};

    for (const inv of paidInvoices) {
      const month = inv.paidAt
        ? `${inv.paidAt.getFullYear()}-${String(inv.paidAt.getMonth() + 1).padStart(2, '0')}`
        : 'unknown';
      byMonthMap[month] = (byMonthMap[month] || 0) + Number(inv.amount);

      const tName = (inv as any).tenant?.name || 'Unknown';
      if (!byTenantMap[tName]) byTenantMap[tName] = { name: tName, amount: 0 };
      byTenantMap[tName].amount += Number(inv.amount);
    }

    return {
      totalRecognized,
      byMonth: Object.entries(byMonthMap).map(([month, amount]) => ({ month, amount })),
      byTenant: Object.values(byTenantMap),
    };
  }

  async seedPlans() {
    const count = await this.planRepository.count();
    if (count > 0) return;

    await this.planRepository.save([
      { slug: 'starter', name: 'Starter', price: 29, maxTenants: 1, maxBranches: 1, maxUsers: 3, isDefault: true },
      { slug: 'professional', name: 'Professional', price: 79, maxTenants: 3, maxBranches: 5, maxUsers: 15, isPopular: true },
      { slug: 'enterprise', name: 'Enterprise', price: 199, maxTenants: 100, maxBranches: 100, maxUsers: 1000 },
    ]);
  }
}
