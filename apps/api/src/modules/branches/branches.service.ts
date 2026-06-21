import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async findAll(tenantId: string): Promise<Branch[]> {
    return this.branchRepository.find({ where: { tenantId } });
  }

  async findById(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }
    return branch;
  }

  async create(data: Partial<Branch>): Promise<Branch> {
    const branch = this.branchRepository.create(data);
    return this.branchRepository.save(branch);
  }

  async update(id: string, data: Partial<Branch>): Promise<Branch> {
    await this.branchRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.branchRepository.delete(id);
  }
}
