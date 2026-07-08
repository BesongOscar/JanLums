import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPlanFlagsToSubscriptionPlans1716744000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('subscription_plans', [
      new TableColumn({ name: 'is_popular', type: 'boolean', default: false }),
      new TableColumn({ name: 'is_default', type: 'boolean', default: false }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('subscription_plans', ['is_popular', 'is_default']);
  }
}
