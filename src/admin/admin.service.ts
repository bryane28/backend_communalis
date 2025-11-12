import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { Student } from '../models/student.schema';
import { Note } from '../models/note.schema';
import { Message } from '../models/message.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getStats() {
    const [users, students, notes, messages, notesByMatiere] = await Promise.all([
      this.userModel.countDocuments({}),
      this.studentModel.countDocuments({}),
      this.noteModel.countDocuments({}),
      this.messageModel.countDocuments({}),
      this.noteModel.aggregate([
        { $group: { _id: '$matiere', moyenne: { $avg: '$note' }, total: { $sum: 1 } } },
        { $project: { _id: 0, matiere: '$_id', moyenne: 1, total: 1 } },
        { $sort: { matiere: 1 } },
      ]),
    ]);

    return {
      users,
      students,
      notes,
      messages,
      notesByMatiere,
    };
  }
}
