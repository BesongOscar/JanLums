import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './entities/inventory.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  async findAll(@Query('tenantId') tenantId: string): Promise<InventoryItem[]> {
    return this.inventoryService.findAll(tenantId);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock items' })
  async getLowStock(@Query('tenantId') tenantId: string): Promise<InventoryItem[]> {
    return this.inventoryService.getLowStock(tenantId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get inventory transactions' })
  async getTransactions(
    @Query('tenantId') tenantId: string,
    @Query('itemId') itemId?: string,
  ): Promise<any[]> {
    return this.inventoryService.getTransactions(tenantId, itemId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  async findById(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<InventoryItem> {
    return this.inventoryService.findById(id, tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory item' })
  async create(@Body() data: Partial<InventoryItem>): Promise<InventoryItem> {
    return this.inventoryService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  async update(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() data: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    return this.inventoryService.update(id, tenantId, data);
  }

  @Post(':id/adjust')
  @ApiOperation({ summary: 'Adjust stock quantity' })
  async adjustStock(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
    @Body() body: { quantity: number; reason: string; userId?: string },
  ): Promise<InventoryItem> {
    return this.inventoryService.adjustStock(id, tenantId, body.quantity, body.reason, body.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  async delete(
    @Param('id') id: string,
    @Query('tenantId') tenantId: string,
  ): Promise<void> {
    return this.inventoryService.delete(id, tenantId);
  }
}
