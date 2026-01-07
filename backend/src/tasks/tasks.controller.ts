import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    console.log('Create task request:', createTaskDto);
    console.log('User:', req.user);
    
    return this.tasksService.create({
      ...createTaskDto,
      organizationId: req.user.organizationId,
      createdById: req.user.userId
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    console.log(`Update task ${id} request:`, updateTaskDto);
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log(`Delete task ${id} request`);
    return this.tasksService.remove(+id);
  }
}
