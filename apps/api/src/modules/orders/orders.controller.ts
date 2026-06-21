import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async findAll(
    @Query('tenantId') tenantId: string,
    @Query('branchId') branchId?: string,
  ): Promise<Order[]> {
    return this.ordersService.findAll(tenantId, branchId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  async getStats(
    @Query('tenantId') tenantId: string,
    @Query('branchId') branchId?: string,
  ): Promise<any> {
    return this.ordersService.getStats(tenantId, branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Order> {
    return this.ordersService.findById(id, tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async create(@Body() data: any): Promise<Order> {
    return this.ordersService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  async update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() data: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, tenantId, data);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateStatus(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, tenantId, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  async delete(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<void> {
    return this.ordersService.delete(id, tenantId);
  }
}
