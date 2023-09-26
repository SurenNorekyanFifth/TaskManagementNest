// task.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CustomersService } from '../customers/customers.service';
import { CreateTaskDto } from './create-task.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.modelName) private taskModel: Model<Task>,
    private readonly customerService: CustomersService,
  ) {}

  async findAllTasks(): Promise<Task[]> {
    return this.taskModel
      .find()
      .populate('assignee')
      .populate('assigned') // Use the path option for array references
      .exec();
  }

  async getAssigneeTaskByUserId(userId: string) {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    return await this.taskModel
      .find({ assignee: userIdObj })
      .populate('assignee')
      .populate('assigned')
      .exec();
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, assigneeId, assignedId } = createTaskDto;

    const assignee = await this.customerService.findOneById(assigneeId);
    const assignedUsers = await this.customerService.findManyByIds(assignedId);
    if (!assignee) {
      console.log(assigneeId);
      throw new NotFoundException(`Customer with id ${assigneeId} not found.`);
    }

    // Create a new Task instance using the Task model
    const task = new this.taskModel({
      title,
      description,
      assignee: assignee,
      assigned: assignedUsers,
    });

    return await task.save();
  }

  async deleteAllTasks(): Promise<void> {
    await this.taskModel.deleteMany({}).exec();
  }
}
