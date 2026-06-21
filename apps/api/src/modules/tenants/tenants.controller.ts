import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { Tenant } from './entities/tenant.entity';

@ApiTags('tenants')
@ApiBearerAuth('JWT')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tenants' })
  async findAll(): Promise<Tenant[]> {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  async findById(@Param('id') id: string): Promise<Tenant> {
    return this.tenantsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create tenant' })
  async create(@Body() data: Partial<Tenant>): Promise<Tenant> {
    return this.tenantsService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tenant' })
  async update(@Param('id') id: string, @Body() data: Partial<Tenant>): Promise<Tenant> {
    return this.tenantsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tenant' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.tenantsService.delete(id);
  }
}
