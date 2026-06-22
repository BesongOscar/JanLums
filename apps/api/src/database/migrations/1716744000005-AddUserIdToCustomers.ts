import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableUnique } from 'typeorm';

export class AddUserIdToCustomers1716744000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('customers', new TableColumn({
      name: 'user_id',
      type: 'uuid',
      isNullable: true,
    }));

    await queryRunner.createUniqueConstraint('customers', new TableUnique({
      name: 'UQ_CUSTOMERS_USER_ID',
      columnNames: ['user_id'],
    }));

    await queryRunner.createForeignKey('customers', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('customers');
    if (!table) return;
    const fk = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    if (fk) {
      await queryRunner.dropForeignKey('customers', fk);
    }
    const unique = table.uniques.find(u => u.columnNames.indexOf('user_id') !== -1);
    if (unique) {
      await queryRunner.dropUniqueConstraint('customers', unique);
    }
    await queryRunner.dropColumn('customers', 'user_id');
  }
}
