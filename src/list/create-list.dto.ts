import { Task } from '../tasks/task.schema';

export class CreateListDto {
  _id: string;
  name: string;
  Tasks: Task[];
}
