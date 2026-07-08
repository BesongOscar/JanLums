import { Controller, Get, Patch, Delete, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { NotificationResponseDto } from './dto/notification-response.dto';
import { UnreadCountResponseDto } from './dto/unread-count-response.dto';
import { CustomersService } from '../customers/customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerOrAdminGuard } from '../auth/guards/customer-or-admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, CustomerOrAdminGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly customersService: CustomersService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get all notifications for current customer' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async findAllMe(
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<Notification[]> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return this.notificationsService.findAllForCustomer(tenantId, customer.id);
  }

  @Get('me/unread-count')
  @ApiOperation({ summary: 'Get unread notification count for current customer' })
  @ApiResponse({ status: 200, type: UnreadCountResponseDto })
  async getUnreadCount(
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<UnreadCountResponseDto> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    const count = await this.notificationsService.getUnreadCount(tenantId, customer.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<Notification> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return this.notificationsService.markAsRead(id, tenantId, customer.id);
  }

  @Patch('me/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'Number of notifications marked as read' })
  async markAllAsRead(
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<{ affected: number }> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    const affected = await this.notificationsService.markAllAsRead(tenantId, customer.id);
    return { affected };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<void> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    return this.notificationsService.delete(id, tenantId, customer.id);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete all notifications for current customer' })
  @ApiResponse({ status: 200, description: 'Number of notifications deleted' })
  async deleteAll(
    @CurrentUser('userId') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ): Promise<{ affected: number }> {
    const customer = await this.customersService.findByUserId(userId);
    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }
    const affected = await this.notificationsService.deleteAll(tenantId, customer.id);
    return { affected };
  }
}
