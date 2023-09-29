import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { TaskList } from './list.schema';
import { ListService } from './list.service';
import { Task } from '../tasks/task.schema';
import { CreateListDto } from './create-list.dto';
import { CreateTaskDto } from '../tasks/create-task.dto';

//list.controller.ts
@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async createList(@Body() list: CreateListDto) {
    return this.listService.createList(list);
  }

  @Get(':id')
  async getListById(@Param('id') id: string) {
    return this.listService.getListById(id);
  }

  @Get('byCustomer/:customerId')
  async getListByUserId(@Param('customerId') customerId: string) {
    console.log(customerId);
    return this.listService.getListByUserId(customerId);
  }

  @Post(':id/tasks')
  async addTaskToList(
    @Param('id') id: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.listService.addTaskToList(id, createTaskDto); // Pass createTaskDto
  }

  @Get()
  async getAllLists() {
    return this.listService.getAllLists();
  }

  @Delete()
  async deleteAllLists() {
    return this.listService.deleteAllLists();
  }

  @Delete(':id')
  async deleteListById(@Param('id') id: string) {
    return this.listService.deleteListById(id);
  }

  @Put(':listId/tasks/:taskId/update-description')
  async updateTaskDescription(
    @Param('listId') listId: string,
    @Param('taskId') taskId: string,
    @Body() updatedTask: Task, // Updated task containing the modified description
  ): Promise<TaskList> {
    return this.listService.updateTaskDescription(listId, taskId, updatedTask);
  }

  @Put(':listId/tasks/:taskId/update-assigned')
  async updateTaskAssigned(
      @Param('listId') listId: string,
      @Param('taskId') taskId: string,
      @Body() updatedTask: Task,
  ){
    return this.listService.updateTaskUsers(listId,taskId,updatedTask)
  }
}
