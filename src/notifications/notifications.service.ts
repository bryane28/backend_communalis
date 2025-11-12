import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  emit(event: string, payload: any) {
    if (this.gateway.server) {
      this.gateway.server.emit(event, payload);
    }
  }

  emitToUser(userId: string, event: string, payload: any) {
    if (this.gateway.server && userId) {
      this.gateway.server.to(`user:${userId}`).emit(event, payload);
    }
  }

  emitToUsers(userIds: (string | undefined | null)[], event: string, payload: any) {
    if (!this.gateway.server) return;
    const rooms = (userIds || [])
      .filter(Boolean)
      .map((id) => `user:${String(id)}`);
    if (rooms.length > 0) {
      this.gateway.server.to(rooms).emit(event, payload);
    }
  }

  messageCreated(message: any) {
    const sender = String(message.senderId);
    const receiver = String(message.receiverId);
    this.emitToUsers([sender, receiver], 'message.created', message);
  }
  messageUpdated(message: any) {
    const sender = String(message.senderId);
    const receiver = String(message.receiverId);
    this.emitToUsers([sender, receiver], 'message.updated', message);
  }
  messageDeleted(messageId: string) {
    // Broadcast delete; services can also target users if they pass context
    this.emit('message.deleted', { id: messageId });
  }

  noteCreated(note: any, recipients?: (string | undefined | null)[]) {
    if (recipients && recipients.length) {
      this.emitToUsers(recipients, 'note.created', note);
    } else {
      this.emit('note.created', note);
    }
  }
  noteUpdated(note: any, recipients?: (string | undefined | null)[]) {
    if (recipients && recipients.length) {
      this.emitToUsers(recipients, 'note.updated', note);
    } else {
      this.emit('note.updated', note);
    }
  }
  noteDeleted(noteId: string, recipients?: (string | undefined | null)[]) {
    if (recipients && recipients.length) {
      this.emitToUsers(recipients, 'note.deleted', { id: noteId });
    } else {
      this.emit('note.deleted', { id: noteId });
    }
  }
}
