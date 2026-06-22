import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true, unique: true })
  userId?: string;

  @OneToOne(() => User, user => user.customer, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column()
  @Index()
  firstName: string;

  @Column()
  @Index()
  lastName: string;

  @Column({ nullable: true })
  @Index()
  email?: string;

  @Column({ nullable: true })
  @Index()
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ type: 'simple-json', nullable: true })
  preferences?: Record<string, any>;

  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
  totalSpent: number;

  @Column({ default: 0 })
  totalOrders: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
