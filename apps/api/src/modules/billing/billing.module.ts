import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Invoice } from './entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, Invoice]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule implements OnModuleInit {
  constructor(private readonly billingService: BillingService) {}

  async onModuleInit() {
    await this.billingService.seedPlans();
  }
}
