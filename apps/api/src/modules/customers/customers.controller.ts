import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('customers')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  async findAll(@Query('tenantId') tenantId: string): Promise<Customer[]> {
    return this.customersService.findAll(tenantId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search customers' })
  async search(
    @Query('tenantId') tenantId: string,
    @Query('q') query: string,
  ): Promise<Customer[]> {
    return this.customersService.search(tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  async findById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Customer> {
    return this.customersService.findById(id, tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create customer' })
  async create(@Body() data: Partial<Customer>): Promise<Customer> {
    return this.customersService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  async update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() data: Partial<Customer>,
  ): Promise<Customer> {
    return this.customersService.update(id, tenantId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  async delete(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<void> {
    return this.customersService.delete(id, tenantId);
  }
}
