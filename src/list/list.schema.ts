import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Task } from '../tasks/task.schema';
import { Customer } from '../customers/customer.schema';

//list.schema.ts
@Schema()
export class TaskList extends Document {
  static readonly modelName = 'TaskList';

  @Prop({ type: Number, required: false })
  id?: string;

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: false })
  customer: Customer;

  @Prop([{ type: Types.ObjectId, ref: 'Task' }])
  Tasks: Task[];
}

export const TaskListSchema = SchemaFactory.createForClass(TaskList);
