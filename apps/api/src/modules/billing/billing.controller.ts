import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Invoice } from './entities/invoice.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('billing')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'List subscription plans' })
  listPlans(): Promise<SubscriptionPlan[]> {
    return this.billingService.listPlans();
  }

  @Post('plans')
  @ApiOperation({ summary: 'Create a subscription plan' })
  createPlan(@Body() data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return this.billingService.createPlan(data);
  }

  @Put('plans/:id')
  @ApiOperation({ summary: 'Update a subscription plan' })
  updatePlan(@Param('id') id: string, @Body() data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    return this.billingService.updatePlan(id, data);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'List invoices with tenant info' })
  listInvoices(@Query('tenantId') tenantId?: string): Promise<Invoice[]> {
    return this.billingService.listInvoices(tenantId);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue recognition data' })
  getRevenueRecognition() {
    return this.billingService.getRevenueRecognition();
  }
}
