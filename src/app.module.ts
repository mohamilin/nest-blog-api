import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// tambahkan   DatabaseModule
import { DatabaseModule } from './core/database/database.module';

@Module({
  // set isGlobal : true agar .env dapat bekerja di seluruh aplikasi
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // tambahkan   DatabaseModule
    DatabaseModule,
  ],
})
export class AppModule {}
