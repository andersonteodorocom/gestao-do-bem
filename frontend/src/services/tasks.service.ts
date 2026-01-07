import { apiClient } from './api';

export interface Task {
  id: number;
  title: string;
  description: string;
  assigneeId?: number;
  assignee?: {
    id: number;
    fullName: string;
  };
  dueDate: string;
  priority?: 'baixa' | 'média' | 'alta' | 'urgente';
  status: 'todo' | 'in-progress' | 'done';
  createdById?: number;
  organizationId?: number;
  completedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assigneeId?: number;
  dueDate: string;
  priority?: 'baixa' | 'média' | 'alta' | 'urgente';
  status?: 'todo' | 'in-progress' | 'done';
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

class TasksService {
  async getAll(): Promise<Task[]> {
    return apiClient.get<Task[]>('/tasks');
  }

  async getOne(id: number): Promise<Task> {
    return apiClient.get<Task>(`/tasks/${id}`);
  }

  async create(data: CreateTaskDto): Promise<Task> {
    return apiClient.post<Task>('/tasks', data);
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    return apiClient.patch<Task>(`/tasks/${id}`, data);
  }

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/tasks/${id}`);
  }
}

export const tasksService = new TasksService();
