import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TaskList } from './list.schema';
import { Task } from '../tasks/task.schema';
import { CreateListDto } from './create-list.dto';
import { CustomersService } from '../customers/customers.service';
import { CreateTaskDto } from '../tasks/create-task.dto';
import { TaskService } from '../tasks/task.service';
import mongoose from 'mongoose';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(TaskList.modelName)
    private readonly listModel: Model<TaskList>,
    private readonly customerService: CustomersService,
    private readonly taskService: TaskService,
  ) {}

  async createList(list: CreateListDto): Promise<TaskList> {
    const createdList = new this.listModel(list);
    return createdList.save();
  }

  async getListById(id: string) {
    try {
      const list = await this.listModel
        .findById(id)
        .populate('customer')
        .populate({
          path: 'Tasks.assignee',
          model: 'Customer', // Make sure this matches the model name
        })
        .exec();

      if (!list) {
        return null; // Handle the case where the list is not found
      }

      return list;
    } catch (error) {
      console.error('Error fetching list by ID:', error);
      throw error; // Handle or rethrow the error as needed
    }
  }

  async getListByUserId(userId: string) {
    const userIdObj = new mongoose.Types.ObjectId(userId);
    return await this.listModel
      .find({
        $or: [{ 'Tasks.assignee': userIdObj }, { 'Tasks.assigned': userIdObj }],
      })
      .populate({
        path: 'Tasks.assignee',
        model: 'Customer', // Make sure this matches the model name
      })
      .exec();
  }

  async addTaskToList(
    listId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<TaskList | null> {
    try {
      // Create the task using the TaskService
      const createdTask = await this.taskService.createTask(createTaskDto);

      // Find the list by ID and push the created task to the Tasks array
      const updatedList = await this.listModel
        .findByIdAndUpdate(
          listId,
          { $push: { Tasks: createdTask } },
          { new: true }, // To return the updated document
        )
        .exec();

      if (!updatedList) {
        return null;
      }

      return updatedList;
    } catch (error) {
      console.error('Error adding task to list:', error);
      throw error;
    }
  }

  async updateTaskDescription(
    listId: string,
    taskId: string,
    updatedTask: Task,
  ): Promise<TaskList | null> {
    try {
      const list = await this.listModel.findById(listId).exec();

      if (!list) {
        throw new Error('List not found');
      }

      const taskToUpdate = list.Tasks.find(
        (task) => task._id.toString() === taskId,
      );

      if (!taskToUpdate) {
        throw new Error('Task not found in the list');
      }

      taskToUpdate.description = updatedTask.description;

      // Mark the 'Tasks' field as modified to ensure it gets saved
      list.markModified('Tasks');

      const updatedList = await list.save();

      if (!updatedList) {
        throw new Error('Failed to save updated list');
      }

      return updatedList;
    } catch (error) {
      // Add error logging
      console.error('Error updating list:', error);
      throw error;
    }
  }

  async getAllLists() {
    return this.listModel
      .find({})
      .populate('customer')
      .populate([
        {
          path: 'Tasks.assigned',
          model: 'Customer',
        },
        {
          path: 'Tasks.assignee',
          model: 'Customer',
        },
      ])
      .exec();
  }

  async updateTaskUsers(
    listId: string,
    taskId: string,
    updatedTask: Task,
  ): Promise<TaskList> {
    const list = await this.listModel.findById(listId).exec();
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const taskToUpdate = list.Tasks.find(
      (task) => task._id.toString() === taskId,
    );
    if (!taskToUpdate) {
      throw new NotFoundException('Task not found');
    }

    taskToUpdate.assigned = updatedTask.assigned;

    list.markModified('Tasks');

    const updatedList = await list.save();

    if (!updatedList) {
      throw new Error('Failed to save updated list');
    }

    return updatedList.populate([
      {
        path: 'Tasks.assigned',
        model: 'Customer', // Make sure this matches the model name
      },
      {
        path: 'Tasks.assignee',
        model: 'Customer', // Make sure this matches the model name
      },
    ]);
  }

  async updateTaskDueDate(
    listId: string,
    taskId: string,
    dueTo: Date,
  ): Promise<TaskList | null> {
    try {
      const list = await this.listModel.findById(listId).exec();

      if (!list) {
        throw new Error('List not found');
      }

      const taskToUpdate = list.Tasks.find(
        (task) => task._id.toString() === taskId,
      );

      if (!taskToUpdate) {
        throw new Error('Task not found in the list');
      }

      // Update the dueTo date of the task
      taskToUpdate.dueTo = dueTo;

      // Mark the 'Tasks' field as modified to ensure it gets saved
      list.markModified('Tasks');

      const updatedList = await list.save();

      if (!updatedList) {
        throw new Error('Failed to save updated list');
      }

      return updatedList;
    } catch (error) {
      // Add error logging
      console.error('Error updating list:', error);
      throw error;
    }
  }

  async deleteAllLists() {
    return this.listModel.deleteMany({}).exec();
  }

  async deleteListById(id: string): Promise<void> {
    return this.listModel.findByIdAndDelete(id);
  }
}
