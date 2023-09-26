import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/task.module';
import { ListService } from './list/list.service';
import { ListController } from './list/list.controller';
import { ListModule } from './list/list.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb+srv://surenn:Suro262003@cluster0.zkeuzij.mongodb.net/?retryWrites=true&w=majority',
      }),
    }),
    CustomersModule,
    AuthModule,
    TaskModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
