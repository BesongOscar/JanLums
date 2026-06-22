import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(tenantId: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { tenantId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, tenantId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findByUserId(userId: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { userId },
    });
  }

  async updateByUserId(userId: string, data: Partial<Customer>): Promise<Customer> {
    const customer = await this.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    await this.customerRepository.update({ userId }, data);
    return this.findByUserId(userId) as Promise<Customer>;
  }

  async findByPhone(phone: string, tenantId: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone, tenantId },
    });
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  async update(id: string, tenantId: string, data: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update({ id, tenantId }, data);
    return this.findById(id, tenantId);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.customerRepository.delete({ id, tenantId });
  }

  async search(tenantId: string, query: string): Promise<Customer[]> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.tenantId = :tenantId', { tenantId })
      .andWhere(
        '(customer.firstName ILIKE :query OR customer.lastName ILIKE :query OR customer.phone ILIKE :query OR customer.email ILIKE :query)',
        { query: `%${query}%` }
      )
      .getMany();
  }
}
