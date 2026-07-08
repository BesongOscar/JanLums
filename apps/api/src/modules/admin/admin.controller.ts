import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get platform admin dashboard stats' })
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants with branch/user/order counts' })
  getTenantsSummary() {
    return this.adminService.getTenantsSummary();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all platform settings' })
  getSettings() {
    return this.adminService.getSettings();
  }

  @Post('settings')
  @ApiOperation({ summary: 'Update a platform setting' })
  updateSetting(@Body() body: { key: string; value: string }) {
    return this.adminService.updateSetting(body.key, body.value);
  }

  @Post('users/:id/reset-password')
  @ApiOperation({ summary: 'Reset user password, returns new password' })
  resetPassword(@Param('id') id: string) {
    return this.adminService.resetPassword(id);
  }

  @Post('tenants/:id/plan')
  @ApiOperation({ summary: 'Assign a subscription plan to a tenant' })
  assignPlan(@Param('id') id: string, @Body() body: { planId: string }) {
    return this.adminService.assignPlan(id, body.planId);
  }

  @Get('analytics/geographic')
  @ApiOperation({ summary: 'Get branch count grouped by city' })
  getGeographicDistribution() {
    return this.adminService.getGeographicDistribution();
  }

  @Get('tenants/:id/metrics')
  @ApiOperation({ summary: 'Get usage metrics for a tenant' })
  getTenantMetrics(@Param('id') id: string) {
    return this.adminService.getTenantMetrics(id);
  }
}
