import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBillingTables1716744000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subscription_plans',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar' },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'max_tenants', type: 'int', default: 1 },
          { name: 'max_branches', type: 'int', default: 1 },
          { name: 'max_users', type: 'int', default: 3 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'tenant_id', type: 'uuid' },
          { name: 'plan_id', type: 'uuid', isNullable: true },
          { name: 'amount', type: 'decimal', precision: 10, scale: 2 },
          { name: 'status', type: 'varchar', default: "'pending'" },
          { name: 'due_date', type: 'timestamp', isNullable: true },
          { name: 'paid_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
        ],
        foreignKeys: [
          {
            columnNames: ['tenant_id'],
            referencedTableName: 'tenants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['plan_id'],
            referencedTableName: 'subscription_plans',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
    await queryRunner.dropTable('subscription_plans');
  }
}
