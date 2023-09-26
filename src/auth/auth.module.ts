import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt'; // Import JwtModule
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomersModule } from '../customers/customers.module';
import { CustomerAuthGuard } from './customer-auth.guard';

@Module({
    imports: [
        CustomersModule,
        JwtModule.register({
            secret: 'your-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}