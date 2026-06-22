import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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

  @Get('me')
  @ApiOperation({ summary: 'Get current customer profile (self-service)' })
  @ApiResponse({ status: 200, description: 'Customer profile found' })
  @ApiResponse({ status: 404, description: 'Customer profile not found' })
  async findMe(@CurrentUser('userId') userId: string): Promise<Customer> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return customer;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current customer profile (self-service)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Customer profile not found' })
  async updateMe(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateMyProfileDto,
  ): Promise<Customer> {
    return this.customersService.updateByUserId(userId, dto);
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
