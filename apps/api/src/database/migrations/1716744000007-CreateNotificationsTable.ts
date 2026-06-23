import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateNotificationsTable1716744000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM (
      'order_created', 'order_received', 'order_processing',
      'order_ready', 'order_completed', 'system'
    )`);

    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
            name: 'customer_id',
            type: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'type',
            type: 'public.notifications_type_enum',
            default: `'system'`,
          },
          {
            name: 'is_read',
            type: 'boolean',
            default: false,
          },
          {
            name: 'metadata',
            type: 'jsonb',
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

    await queryRunner.createForeignKey('notifications', new TableForeignKey({
      columnNames: ['tenant_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'tenants',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('notifications', new TableForeignKey({
      columnNames: ['customer_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'customers',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_TENANT',
      columnNames: ['tenant_id'],
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_CUSTOMER',
      columnNames: ['customer_id'],
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_IS_READ',
      columnNames: ['is_read'],
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_CREATED_AT',
      columnNames: ['created_at'],
    }));

    await queryRunner.createIndex('notifications', new TableIndex({
      name: 'IDX_NOTIFICATIONS_CUSTOMER_IS_READ',
      columnNames: ['customer_id', 'is_read'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
  }
}
