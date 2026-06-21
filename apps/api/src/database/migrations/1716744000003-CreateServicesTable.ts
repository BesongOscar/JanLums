import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateServicesTable1716744000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
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
            name: 'base_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'express_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pricing_unit',
            type: 'varchar',
            default: "'per_item'",
          },
          {
            name: 'estimated_hours',
            type: 'int',
            default: 1,
          },
          {
            name: 'fabric_types',
            type: 'json',
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

    await queryRunner.createForeignKey('services', new TableForeignKey({
      columnNames: ['tenant_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('services', new TableIndex({
      name: 'IDX_SERVICES_TENANT',
      columnNames: ['tenant_id'],
    }));

    await queryRunner.createIndex('services', new TableIndex({
      name: 'IDX_SERVICES_CATEGORY',
      columnNames: ['category'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('services');
  }
}
