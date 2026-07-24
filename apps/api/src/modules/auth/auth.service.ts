import { Injectable, UnauthorizedException, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { LoginDto, ALLOWED_PLATFORMS } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const PLATFORM_ROLES: Record<string, string[]> = {
  'customer-mobile': ['customer'],
  'admin-web': ['admin', 'platform_admin'],
  'pressing-web': ['admin', 'platform_admin', 'counter_staff'],
  'customer-web': ['customer'],
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async login(loginDto: LoginDto) {
    let user: User | null;
    let tenantName: string | null = null;

    if (loginDto.tenantSlug) {
      const tenant = await this.tenantRepository.findOne({ where: { slug: loginDto.tenantSlug } });
      if (!tenant) {
        throw new UnauthorizedException('Invalid tenant');
      }
      tenantName = tenant.name;
      user = await this.usersService.findByEmailAndTenant(loginDto.email, tenant.id);
    } else {
      user = await this.usersService.findByEmail(loginDto.email);
    }
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!tenantName && user.tenantId) {
      const tenant = await this.tenantRepository.findOne({ where: { id: user.tenantId } });
      tenantName = tenant?.name ?? null;
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (loginDto.platform) {
      const allowedRoles = PLATFORM_ROLES[loginDto.platform];
      if (!allowedRoles || !allowedRoles.includes(user.role)) {
        throw new ForbiddenException('This account is not authorized for this application.');
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenantName,
        tenantSlug: loginDto.tenantSlug || null,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    let tenantId = registerDto.tenantId;

    if (registerDto.tenantSlug) {
      const tenant = await this.tenantRepository.findOne({ where: { slug: registerDto.tenantSlug } });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
      tenantId = tenant.id;
    }

    if (!tenantId) {
      throw new UnauthorizedException('Tenant identifier is required');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.dataSource.transaction(async (manager) => {
      const newUser = await manager.save(User, {
        email: registerDto.email,
        passwordHash,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        tenantId,
        role: registerDto.role || 'customer',
      });

      await manager.save(Customer, {
        userId: newUser.id,
        tenantId: newUser.tenantId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
      });

      return newUser;
    });

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}
