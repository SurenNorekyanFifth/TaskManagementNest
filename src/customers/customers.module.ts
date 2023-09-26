import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {Customer, CustomerSchema} from "./customer.schema";
import {CustomersController} from "./customers.controller";
import {CustomersService} from "./customers.service";

//customers.module.ts
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Customer.modelName, schema: CustomerSchema },
        ]),
        // UploadModule,
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule {}
