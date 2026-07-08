import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('users')
@Index(['email', 'tenantId'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column()
  @Index()
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'counter_staff' })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @OneToOne(() => Customer, customer => customer.user, { nullable: true })
  customer?: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
