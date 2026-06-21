import { DataSource } from 'typeorm';
import { Tenant } from '../../modules/tenants/entities/tenant.entity';
import { Branch } from '../../modules/branches/entities/branch.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Customer } from '../../modules/customers/entities/customer.entity';
import { Service } from '../../modules/services/entities/service.entity';
import { Order, OrderItem } from '../../modules/orders/entities/order.entity';
import * as bcrypt from 'bcryptjs';

export class SeedRunner {
  constructor(private dataSource: DataSource) {}

  async seedReferenceData(): Promise<void> {
    console.log('Seeding reference data...');
    // Reference data will be added in future migrations
    // (garment types, fabric types, services, etc.)
    console.log('Reference data seeding completed.');
  }

  async seedDemoData(): Promise<void> {
    console.log('Seeding demo data...');

    const tenantRepository = this.dataSource.getRepository(Tenant);
    const branchRepository = this.dataSource.getRepository(Branch);
    const userRepository = this.dataSource.getRepository(User);
    const customerRepository = this.dataSource.getRepository(Customer);
    const serviceRepository = this.dataSource.getRepository(Service);
    const orderRepository = this.dataSource.getRepository(Order);
    const orderItemRepository = this.dataSource.getRepository(OrderItem);

    // Create demo tenant
    let demoTenant = await tenantRepository.findOne({ where: { slug: 'pressing237' } });
    
    if (!demoTenant) {
      demoTenant = tenantRepository.create({
        slug: 'pressing237',
        name: 'Pressing 237',
        primaryColor: '#007bff',
        status: 'active',
        settings: {
          currency: 'XAF',
          timezone: 'Africa/Douala',
          allowOnlineOrders: true,
          requirePhoneVerification: false,
        },
      });
      demoTenant = await tenantRepository.save(demoTenant);
      console.log('Created demo tenant: Pressing 237');
    }

    // Create demo branch
    let demoBranch = await branchRepository.findOne({ 
      where: { tenantId: demoTenant.id, name: 'Main Branch' } 
    });

    if (!demoBranch) {
      demoBranch = branchRepository.create({
        tenantId: demoTenant.id,
        name: 'Main Branch',
        address: '123 Main Street, Douala',
        city: 'Douala',
        phone: '+237 123 456 789',
        email: 'main@pressing237.com',
        isActive: true,
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '15:00' },
          sunday: { open: null, close: null },
        },
      });
      demoBranch = await branchRepository.save(demoBranch);
      console.log('Created demo branch: Main Branch');
    }

    // Create admin user
    let adminUser = await userRepository.findOne({ 
      where: { email: 'admin@pressing237.com' } 
    });

    if (!adminUser) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      adminUser = userRepository.create({
        tenantId: demoTenant.id,
        email: 'admin@pressing237.com',
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+237 123 456 789',
        role: 'admin',
        isActive: true,
      });
      adminUser = await userRepository.save(adminUser);
      console.log('Created admin user: admin@pressing237.com');
    }

    // Create counter staff user
    let counterStaff = await userRepository.findOne({ 
      where: { email: 'counter@pressing237.com' } 
    });

    if (!counterStaff) {
      const passwordHash = await bcrypt.hash('counter123', 10);
      counterStaff = userRepository.create({
        tenantId: demoTenant.id,
        email: 'counter@pressing237.com',
        passwordHash,
        firstName: 'Counter',
        lastName: 'Staff',
        phone: '+237 987 654 321',
        role: 'counter_staff',
        isActive: true,
      });
      counterStaff = await userRepository.save(counterStaff);
      console.log('Created counter staff: counter@pressing237.com');
    }

    // Create sample services
    const services = [
      { name: 'Wash & Fold', category: 'washing', basePrice: 500, estimatedHours: 24 },
      { name: 'Dry Cleaning', category: 'dry_cleaning', basePrice: 1500, estimatedHours: 48 },
      { name: 'Ironing/Pressing', category: 'pressing', basePrice: 300, estimatedHours: 12 },
      { name: 'Stain Removal', category: 'specialty', basePrice: 1000, estimatedHours: 72 },
      { name: 'Express Service', category: 'express', basePrice: 2000, estimatedHours: 4 },
    ];

    for (const serviceData of services) {
      let service = await serviceRepository.findOne({
        where: { tenantId: demoTenant.id, name: serviceData.name }
      });
      if (!service) {
        service = serviceRepository.create({
          tenantId: demoTenant.id,
          ...serviceData,
          pricingUnit: 'per_item',
          isActive: true,
        });
        await serviceRepository.save(service);
        console.log(`Created service: ${serviceData.name}`);
      }
    }

    // Create sample customers
    const customers = [
      { firstName: 'Jean', lastName: 'Dupont', phone: '+237 6 12 34 56 78', email: 'jean.dupont@email.com', city: 'Douala' },
      { firstName: 'Marie', lastName: 'Claire', phone: '+237 6 23 45 67 89', email: 'marie.claire@email.com', city: 'Douala' },
      { firstName: 'Paul', lastName: 'Martin', phone: '+237 6 34 56 78 90', email: 'paul.martin@email.com', city: 'Yaounde' },
      { firstName: 'Sarah', lastName: 'Johnson', phone: '+237 6 45 67 89 01', email: 'sarah.johnson@email.com', city: 'Douala' },
    ];

    const createdCustomers: Customer[] = [];
    for (const customerData of customers) {
      let customer = await customerRepository.findOne({
        where: { tenantId: demoTenant.id, phone: customerData.phone }
      });
      if (!customer) {
        customer = customerRepository.create({
          tenantId: demoTenant.id,
          ...customerData,
          isActive: true,
        });
        customer = await customerRepository.save(customer);
        console.log(`Created customer: ${customerData.firstName} ${customerData.lastName}`);
      }
      createdCustomers.push(customer);
    }

    // Create sample orders
    const sampleOrders = [
      {
        customerId: createdCustomers[0].id,
        status: 'processing',
        items: [
          { garmentType: 'Shirt', quantity: 3, unitPrice: 500, totalPrice: 1500 },
          { garmentType: 'Trousers', quantity: 2, unitPrice: 700, totalPrice: 1400 },
        ],
        total: 2900,
      },
      {
        customerId: createdCustomers[1].id,
        status: 'ready',
        items: [
          { garmentType: 'Dress', quantity: 1, unitPrice: 1500, totalPrice: 1500 },
          { garmentType: 'Blouse', quantity: 2, unitPrice: 800, totalPrice: 1600 },
        ],
        total: 3100,
      },
      {
        customerId: createdCustomers[2].id,
        status: 'pending',
        items: [
          { garmentType: 'Suit', quantity: 1, unitPrice: 3000, totalPrice: 3000 },
          { garmentType: 'Shirt', quantity: 5, unitPrice: 500, totalPrice: 2500 },
        ],
        total: 5500,
      },
    ];

    for (const orderData of sampleOrders) {
      const existingOrder = await orderRepository.findOne({
        where: { tenantId: demoTenant.id, customerId: orderData.customerId }
      });
      if (!existingOrder) {
        const order = orderRepository.create({
          tenantId: demoTenant.id,
          branchId: demoBranch.id,
          staffId: counterStaff.id,
          ...orderData,
          subtotal: orderData.total,
          tax: 0,
          discount: 0,
        });
        const savedOrder = await orderRepository.save(order);

        // Create order items
        for (const itemData of orderData.items) {
          const orderItem = orderItemRepository.create({
            orderId: savedOrder.id,
            ...itemData,
            status: 'pending',
          });
          await orderItemRepository.save(orderItem);
        }
        console.log(`Created order for customer: ${orderData.customerId}`);
      }
    }

    console.log('Demo data seeding completed.');
  }
}
