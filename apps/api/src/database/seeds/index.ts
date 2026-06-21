import { DataSource } from 'typeorm';
import { SeedRunner } from './seed-runner';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';
import { Branch } from '../../modules/branches/entities/branch.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { Service } from '../../modules/services/entities/service.entity';
import { Order, OrderItem } from '../../modules/orders/entities/order.entity';
import { SnakeNamingStrategy } from '../naming-strategy';
import * as dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'janlums',
    entities: [Tenant, Branch, User, Customer, Service, Order, OrderItem],
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  });

  await dataSource.initialize();
  console.log('Database connected for seeding...');

  const seedRunner = new SeedRunner(dataSource);

  // Seed reference data
  await seedRunner.seedReferenceData();

  // Seed demo data
  await seedRunner.seedDemoData();

  console.log('Seeding completed successfully!');
  await dataSource.destroy();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
