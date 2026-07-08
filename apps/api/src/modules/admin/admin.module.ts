import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Order, OrderItem } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Branch } from '../branches/entities/branch.entity';
import { PlatformSetting } from './entities/platform-setting.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { SubscriptionPlan } from '../billing/entities/subscription-plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, Order, OrderItem, User, Branch, PlatformSetting, Invoice, SubscriptionPlan]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
