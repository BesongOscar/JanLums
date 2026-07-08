import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email, tenantId } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: Partial<User> & { password?: string }): Promise<User> {
    const userData: Record<string, any> = { ...data };
    if (data.password) {
      userData.passwordHash = await bcrypt.hash(data.password, 10);
      delete userData.password;
    }
    const user = this.userRepository.create(userData as Partial<User>);
    return this.userRepository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findAll(tenantId?: string, role?: string, page?: number, limit?: number): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (role) where.role = role;
    const p = page || 1;
    const l = limit || 50;
    const [data, total] = await this.userRepository.findAndCount({
      where,
      take: l,
      skip: (p - 1) * l,
      order: { createdAt: 'DESC' },
    });
    return { data, total, page: p, limit: l };
  }
}
