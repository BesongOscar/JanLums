import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { Branch } from './entities/branch.entity';

@ApiTags('branches')
@ApiBearerAuth('JWT')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all branches' })
  async findAll(@Query('tenantId') tenantId: string): Promise<Branch[]> {
    return this.branchesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch by ID' })
  async findById(@Param('id') id: string): Promise<Branch> {
    return this.branchesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create branch' })
  async create(@Body() data: Partial<Branch>): Promise<Branch> {
    return this.branchesService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update branch' })
  async update(@Param('id') id: string, @Body() data: Partial<Branch>): Promise<Branch> {
    return this.branchesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete branch' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.branchesService.delete(id);
  }
}
