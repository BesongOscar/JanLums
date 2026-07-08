import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { CustomersService } from '../customers/customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerOrAdminGuard } from '../auth/guards/customer-or-admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('addresses')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, CustomerOrAdminGuard)
@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly customersService: CustomersService,
  ) {}

  private async resolveCustomerId(userId: string): Promise<string> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return customer.id;
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for current customer' })
  async findAll(@CurrentUser('userId') userId: string): Promise<Address[]> {
    const customerId = await this.resolveCustomerId(userId);
    return this.addressesService.findByCustomerId(customerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  async findById(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<Address> {
    const customerId = await this.resolveCustomerId(userId);
    return this.addressesService.findById(id, customerId);
  }

  @Post()
  @ApiOperation({ summary: 'Create address' })
  async create(
    @Body() data: Partial<Address>,
    @CurrentUser('userId') userId: string,
  ): Promise<Address> {
    const customerId = await this.resolveCustomerId(userId);
    return this.addressesService.create(customerId, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Address>,
    @CurrentUser('userId') userId: string,
  ): Promise<Address> {
    const customerId = await this.resolveCustomerId(userId);
    return this.addressesService.update(id, customerId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<void> {
    const customerId = await this.resolveCustomerId(userId);
    return this.addressesService.delete(id, customerId);
  }
}
