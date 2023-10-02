import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Customer } from '../customers/customer.schema';

//tasks.schema.ts
@Schema()
export class Task extends Document {
  static readonly modelName = 'Task';

  @Prop({ type: Number, required: false })
  id?: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  taskImage: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: false })
  assignee: Customer;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: false })
  assigned: Customer[];

  @Prop({ type: Date, required: false })
  dueTo: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
