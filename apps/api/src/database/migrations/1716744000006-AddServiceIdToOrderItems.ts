import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddServiceIdToOrderItems1716744000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('order_items', new TableColumn({
      name: 'service_id',
      type: 'uuid',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order_items', 'service_id');
  }
}
