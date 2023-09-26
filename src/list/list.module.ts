import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskList, TaskListSchema } from './list.schema'; // Import the schema and schema factory

import { ListController } from './list.controller';
import { ListService } from './list.service';
import { CustomersModule } from '../customers/customers.module';
import { TaskModule } from '../tasks/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskList.modelName, schema: TaskListSchema },
    ]),
    CustomersModule,
    TaskModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
