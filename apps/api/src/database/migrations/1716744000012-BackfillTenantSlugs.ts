import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillTenantSlugs1716744000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tenants = await queryRunner.query(
      `SELECT id, name, slug FROM "tenants" WHERE slug IS NULL OR slug = ''`,
    );

    for (const tenant of tenants) {
      const baseSlug = this.generateSlug(tenant.name);

      let slug = baseSlug;
      let counter = 2;
      while (true) {
        const existing = await queryRunner.query(
          `SELECT id FROM "tenants" WHERE slug = $1 AND id != $2`,
          [slug, tenant.id],
        );
        if (existing.length === 0) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await queryRunner.query(
        `UPDATE "tenants" SET slug = $1 WHERE id = $2`,
        [slug, tenant.id],
      );
    }

    await queryRunner.query(
      `ALTER TABLE "tenants" ALTER COLUMN slug SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

  private generateSlug(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      || 'tenant';
  }
}
