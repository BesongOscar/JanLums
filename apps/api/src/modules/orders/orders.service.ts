import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { Service } from '../services/entities/service.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
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

  async create(
    tenantId: string,
    customerId: string,
    dto: CreateOrderDto,
  ): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const orderRepo = manager.getRepository(Order);
      const orderItemRepo = manager.getRepository(OrderItem);
      const serviceRepo = manager.getRepository(Service);

      const resolvedItems: Partial<OrderItem>[] = [];

      for (const item of dto.items) {
        const service = await serviceRepo.findOne({
          where: { id: item.serviceId, tenantId },
        });

        if (!service) {
          throw new NotFoundException(`Service "${item.serviceId}" not found`);
        }

        const unitPrice = dto.isExpress && service.expressPrice != null
          ? Number(service.expressPrice)
          : Number(service.basePrice);

        const totalPrice = unitPrice * item.quantity;

        resolvedItems.push({
          serviceId: item.serviceId,
          garmentType: service.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          specialInstructions: item.specialInstructions,
          status: 'pending',
        });
      }

      const subtotal = resolvedItems.reduce(
        (sum, item) => sum + item.totalPrice!,
        0,
      );
      const tax = Number((subtotal * 0.1925).toFixed(2));
      const total = subtotal + tax;

      const order = orderRepo.create({
        tenantId,
        customerId,
        branchId: dto.branchId,
        notes: dto.notes,
        isExpress: dto.isExpress ?? false,
        status: 'pending',
        subtotal,
        tax,
        total,
      });

      order.items = resolvedItems.map((ri) => orderItemRepo.create(ri));

      return orderRepo.save(order);
    });
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
