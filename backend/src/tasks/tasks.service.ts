import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    console.log('Creating task:', createTaskDto);
    
    const task = this.taskRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TODO,
    });
    
    const savedTask = await this.taskRepository.save(task);
    console.log('Task created:', savedTask);
    
    // Return with relations
    return this.findOne(savedTask.id);
  }

  async findAll(organizationId: number) {
    const tasks = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.organizationId = :organizationId', { organizationId })
      .orderBy('task.dueDate', 'ASC')
      .addOrderBy('task.priority', 'DESC')
      .getMany();
    
    console.log(`Found ${tasks.length} tasks for organization ${organizationId}`);
    return tasks;
  }

  async findOne(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.createdBy', 'createdBy')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    console.log(`Updating task ${id}:`, updateTaskDto);
    
    const task = await this.findOne(id);
    
    // Update fields
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.dueDate) task.dueDate = new Date(updateTaskDto.dueDate);
    if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
    if (updateTaskDto.assigneeId !== undefined) task.assigneeId = updateTaskDto.assigneeId;
    
    // Handle status change
    if (updateTaskDto.status) {
      task.status = updateTaskDto.status;
      if (updateTaskDto.status === TaskStatus.DONE && !task.completedAt) {
        task.completedAt = new Date();
        console.log('Task marked as done at:', task.completedAt);
      } else if (updateTaskDto.status !== TaskStatus.DONE && task.completedAt) {
        task.completedAt = null;
      }
    }
    
    const savedTask = await this.taskRepository.save(task);
    console.log('Task updated:', savedTask);
    
    return this.findOne(savedTask.id);
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    console.log(`Task ${id} deleted successfully`);
    return { message: 'Task deleted successfully' };
  }
}
