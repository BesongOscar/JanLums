import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAll(tenantId: string, branchId?: string): Promise<Order[]> {
    const where: any = { tenantId };
    if (branchId) {
      where.branchId = branchId;
    }
    return this.orderRepository.find({
      where,
      relations: ['items', 'staff'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCustomerId(customerId: string, tenantId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId, tenantId },
      relations: ['items', 'staff', 'branch'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id, tenantId },
      relations: ['items', 'staff', 'branch'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async create(data: Partial<Order> & { items?: Partial<OrderItem>[] }): Promise<Order> {
    const order = this.orderRepository.create(data);
    
    if (data.items && data.items.length > 0) {
      order.items = data.items.map(item => this.orderItemRepository.create(item));
      order.subtotal = order.items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
      order.total = order.subtotal + Number(order.tax || 0) - Number(order.discount || 0);
    }

    return this.orderRepository.save(order);
  }

  async update(id: string, tenantId: string, data: Partial<Order>): Promise<Order> {
    await this.orderRepository.update({ id, tenantId }, data);
    return this.findById(id, tenantId);
  }

  async updateStatus(id: string, tenantId: string, status: string): Promise<Order> {
    await this.orderRepository.update({ id, tenantId }, { status });
    return this.findById(id, tenantId);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.orderRepository.delete({ id, tenantId });
  }

  async getStats(tenantId: string, branchId?: string): Promise<any> {
    const where: any = { tenantId };
    if (branchId) {
      where.branchId = branchId;
    }

    const [totalOrders, pendingOrders, processingOrders, readyOrders, completedOrders] = await Promise.all([
      this.orderRepository.count({ where }),
      this.orderRepository.count({ where: { ...where, status: 'pending' } }),
      this.orderRepository.count({ where: { ...where, status: 'processing' } }),
      this.orderRepository.count({ where: { ...where, status: 'ready' } }),
      this.orderRepository.count({ where: { ...where, status: 'completed' } }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      readyOrders,
      completedOrders,
    };
  }
}
