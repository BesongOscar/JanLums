import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateInventoryTables1716744000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create inventory_items table
    await queryRunner.createTable(
      new Table({
        name: 'inventory_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tenant_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'unit',
            type: 'varchar',
          },
          {
            name: 'min_stock_level',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'unit_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'total_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'supplier',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'expiry_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create inventory_transactions table
    await queryRunner.createTable(
      new Table({
        name: 'inventory_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'tenant_id',
            type: 'uuid',
          },
          {
            name: 'item_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey('inventory_items', new TableForeignKey({
      columnNames: ['tenant_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('inventory_transactions', new TableForeignKey({
      columnNames: ['tenant_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('inventory_transactions', new TableForeignKey({
      columnNames: ['item_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'inventory_items',
      onDelete: 'CASCADE',
    }));

    // Create indexes
    await queryRunner.createIndex('inventory_items', new TableIndex({
      name: 'IDX_INVENTORY_TENANT',
      columnNames: ['tenant_id'],
    }));

    await queryRunner.createIndex('inventory_items', new TableIndex({
      name: 'IDX_INVENTORY_CATEGORY',
      columnNames: ['category'],
    }));

    await queryRunner.createIndex('inventory_transactions', new TableIndex({
      name: 'IDX_INVENTORY_TRANS_ITEM',
      columnNames: ['item_id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('inventory_transactions');
    await queryRunner.dropTable('inventory_items');
  }
}
