import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async findAll(tenantId: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { tenantId, isActive: true },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id, tenantId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async findByCategory(tenantId: string, category: string): Promise<Service[]> {
    return this.serviceRepository.find({
      where: { tenantId, category, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async create(data: Partial<Service>): Promise<Service> {
    const service = this.serviceRepository.create(data);
    return this.serviceRepository.save(service);
  }

  async update(id: string, tenantId: string, data: Partial<Service>): Promise<Service> {
    await this.serviceRepository.update({ id, tenantId }, data);
    return this.findById(id, tenantId);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.serviceRepository.delete({ id, tenantId });
  }
}
