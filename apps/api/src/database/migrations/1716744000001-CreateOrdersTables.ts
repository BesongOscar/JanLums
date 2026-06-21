import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateOrdersTables1716744000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create orders table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
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
            name: 'branch_id',
            type: 'uuid',
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'staff_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'tax',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'amount_paid',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'payment_details',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'pickup_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'delivery_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'is_express',
            type: 'boolean',
            default: false,
          },
          {
            name: 'qr_code',
            type: 'varchar',
            isNullable: true,
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

    // Create order_items table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'garment_type',
            type: 'varchar',
          },
          {
            name: 'fabric_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'color',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'int',
            default: 1,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'special_instructions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'qr_code',
            type: 'varchar',
            isNullable: true,
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

    // Add foreign keys
    await queryRunner.createForeignKey('orders', new TableForeignKey({
      columnNames: ['tenant_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('orders', new TableForeignKey({
      columnNames: ['branch_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'branches',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('orders', new TableForeignKey({
      columnNames: ['staff_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createForeignKey('order_items', new TableForeignKey({
      columnNames: ['order_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'orders',
      onDelete: 'CASCADE',
    }));

    // Create indexes
    await queryRunner.createIndex('orders', new TableIndex({
      name: 'IDX_ORDERS_TENANT',
      columnNames: ['tenant_id'],
    }));

    await queryRunner.createIndex('orders', new TableIndex({
      name: 'IDX_ORDERS_BRANCH',
      columnNames: ['branch_id'],
    }));

    await queryRunner.createIndex('orders', new TableIndex({
      name: 'IDX_ORDERS_STATUS',
      columnNames: ['status'],
    }));

    await queryRunner.createIndex('order_items', new TableIndex({
      name: 'IDX_ORDER_ITEMS_ORDER',
      columnNames: ['order_id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
  }
}
