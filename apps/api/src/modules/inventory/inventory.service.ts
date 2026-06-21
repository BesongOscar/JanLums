import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem, InventoryTransaction } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly itemRepository: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction)
    private readonly transactionRepository: Repository<InventoryTransaction>,
  ) {}

  async findAll(tenantId: string): Promise<InventoryItem[]> {
    return this.itemRepository.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string, tenantId: string): Promise<InventoryItem> {
    const item = await this.itemRepository.findOne({
      where: { id, tenantId },
    });
    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }
    return item;
  }

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.itemRepository.create(data);
    item.totalValue = Number(item.quantity) * Number(item.unitCost);
    return this.itemRepository.save(item);
  }

  async update(id: string, tenantId: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    await this.itemRepository.update({ id, tenantId }, data);
    return this.findById(id, tenantId);
  }

  async adjustStock(
    id: string, 
    tenantId: string, 
    quantity: number, 
    reason: string,
    userId?: string
  ): Promise<InventoryItem> {
    const item = await this.findById(id, tenantId);
    const oldQuantity = Number(item.quantity);
    const newQuantity = oldQuantity + quantity;

    // Update item quantity
    item.quantity = newQuantity;
    item.totalValue = newQuantity * Number(item.unitCost);
    await this.itemRepository.save(item);

    // Create transaction record
    const transaction = this.transactionRepository.create({
      tenantId,
      itemId: id,
      quantity,
      type: quantity > 0 ? 'in' : 'out',
      reason,
      userId,
    });
    await this.transactionRepository.save(transaction);

    return item;
  }

  async getTransactions(tenantId: string, itemId?: string): Promise<InventoryTransaction[]> {
    const where: any = { tenantId };
    if (itemId) {
      where.itemId = itemId;
    }
    return this.transactionRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getLowStock(tenantId: string): Promise<InventoryItem[]> {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.tenantId = :tenantId', { tenantId })
      .andWhere('item.quantity <= item.minStockLevel')
      .getMany();
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.itemRepository.delete({ id, tenantId });
  }
}
