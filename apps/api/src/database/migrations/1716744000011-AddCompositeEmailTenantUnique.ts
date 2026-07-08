import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddCompositeEmailTenantUnique1716744000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the non-unique index on email
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    // 2. Drop the unique constraint on email column
    const result = await queryRunner.query(
      `SELECT conname AS constraint_name FROM pg_constraint
       WHERE conrelid = 'users'::regclass
       AND contype = 'u'`,
    );
    if (result.length > 0) {
      await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "${result[0].constraint_name}"`);
    }

    // 3. Create composite unique index on (email, tenant_id)
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL_TENANT_UNIQUE',
        columnNames: ['email', 'tenant_id'],
        isUnique: true,
      }),
    );

    // 4. Recreate non-unique index on email for lookup performance
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the composite unique index
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL_TENANT_UNIQUE');

    // 2. Drop the non-unique index on email
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');

    // 3. Recreate unique constraint on email
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_email" UNIQUE ("email")`);

    // 4. Recreate non-unique index on email
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USERS_EMAIL',
        columnNames: ['email'],
      }),
    );
  }
}
