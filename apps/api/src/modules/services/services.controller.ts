import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('services')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  async findAll(@Query('tenantId') tenantId: string): Promise<Service[]> {
    return this.servicesService.findAll(tenantId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get services by category' })
  async findByCategory(
    @Param('category') category: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Service[]> {
    return this.servicesService.findByCategory(tenantId, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  async findById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Service> {
    return this.servicesService.findById(id, tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create service' })
  async create(@Body() data: Partial<Service>): Promise<Service> {
    return this.servicesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update service' })
  async update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() data: Partial<Service>,
  ): Promise<Service> {
    return this.servicesService.update(id, tenantId, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  async delete(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<void> {
    return this.servicesService.delete(id, tenantId);
  }
}
