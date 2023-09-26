// task.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.schema';
import { CreateTaskDto } from './create-task.dto';
import { CustomerAuthGuard } from '../auth/customer-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(CustomerAuthGuard)
  @Get()
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.findAllTasks();
  }

  @Get(':userId')
  async getAssigneeTasksByUserId(@Param('userId') userId: string) {
    return this.taskService.getAssigneeTaskByUserId(userId);
  }

  @UseGuards(CustomerAuthGuard)
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @UseGuards(CustomerAuthGuard)
  @Delete('all')
  async deleteAllTasks(): Promise<void> {
    await this.taskService.deleteAllTasks();
  }
}
