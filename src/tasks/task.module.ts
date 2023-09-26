import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CustomersModule } from '../customers/customers.module';
import { JwtModule } from '@nestjs/jwt';
//customers.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.modelName, schema: TaskSchema }]),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    CustomersModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
