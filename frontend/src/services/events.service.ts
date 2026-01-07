import { apiClient } from './api';

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxParticipants: number;
  confirmedParticipants: number;
  status: 'confirmed' | 'planned' | 'cancelled' | 'completed';
  createdById?: number;
  organizationId?: number;
}

export interface CreateEventDto {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  maxParticipants: number;
  status?: 'confirmed' | 'planned';
  organizationId?: number; // Opcional, será adicionado pelo backend via JWT
}

export type UpdateEventDto = Partial<CreateEventDto>;

class EventsService {
  async getAll(): Promise<Event[]> {
    return apiClient.get<Event[]>('/events');
  }

  async getOne(id: number): Promise<Event> {
    return apiClient.get<Event>(`/events/${id}`);
  }

  async create(data: CreateEventDto): Promise<Event> {
    return apiClient.post<Event>('/events', data);
  }

  async update(id: number, data: UpdateEventDto): Promise<Event> {
    return apiClient.patch<Event>(`/events/${id}`, data);
  }

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/events/${id}`);
  }

  async register(eventId: number): Promise<{ message: string }> {
    return apiClient.post(`/events/${eventId}/register`);
  }

  async unregister(eventId: number): Promise<{ message: string }> {
    return apiClient.delete(`/events/${eventId}/unregister`);
  }
}

export const eventsService = new EventsService();
