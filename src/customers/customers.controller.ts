import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {CustomersService} from "./customers.service";
import {Customer} from "./customer.schema";
import {CreateCustomerDto} from "./create-customer.dto";

@Controller('customers')
export class CustomersController {
    constructor(
        private customersService: CustomersService,
        // private uploadService: UploadService,
    ) {}

    @Get()
    async findAll(): Promise<Customer[]> {
        return this.customersService.findAll();
    }
    // @Get('/:id/profile-photo')
    // async getProfilePhoto(@Param('id') id: string): Promise<Customer[]> {
    //     return this.customersService.findAll();
    // }

    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }

    @Delete()
    async deleteAll(): Promise<{ message: string }> {
        await this.customersService.deleteAll();
        return { message: 'All customers deleted' };
    }
}
