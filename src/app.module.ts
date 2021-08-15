import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// tambahkan   DatabaseModule
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  // set isGlobal : true agar .env dapat bekerja di seluruh aplikasi
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // tambahkan   DatabaseModule
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
