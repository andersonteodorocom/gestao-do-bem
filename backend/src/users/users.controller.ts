import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: any, @Request() req) {
    console.log('Create user request:', createUserDto);
    console.log('User organizationId:', req.user.organizationId);
    return this.usersService.create({
      ...createUserDto,
      organizationId: req.user.organizationId
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(+id);
  }
}
