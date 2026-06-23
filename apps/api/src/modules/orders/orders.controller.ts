import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CustomersService } from '../customers/customers.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
  ) {}

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

  @Get('me')
  @ApiOperation({ summary: 'Get current customer orders (self-service)' })
  @ApiResponse({ status: 200, description: 'Customer orders retrieved' })
  async findMe(
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<Order[]> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      return [];
    }
    return this.ordersService.findByCustomerId(customer.id, tenantId);
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
  @ApiResponse({ status: 201, description: 'Order created' })
  async create(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<Order> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return this.ordersService.create(tenantId, customer.id, dto);
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
