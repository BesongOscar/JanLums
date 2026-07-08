import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async findByCustomerId(customerId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { customerId },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findById(id: string, customerId: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id, customerId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async create(customerId: string, data: Partial<Address>): Promise<Address> {
    if (data.isDefault) {
      await this.addressRepository.update({ customerId, isDefault: true }, { isDefault: false });
    }
    const address = this.addressRepository.create({ ...data, customerId });
    return this.addressRepository.save(address);
  }

  async update(id: string, customerId: string, data: Partial<Address>): Promise<Address> {
    if (data.isDefault) {
      await this.addressRepository.update({ customerId, isDefault: true }, { isDefault: false });
    }
    await this.addressRepository.update({ id, customerId }, data);
    return this.findById(id, customerId);
  }

  async delete(id: string, customerId: string): Promise<void> {
    await this.addressRepository.delete({ id, customerId });
  }
}
