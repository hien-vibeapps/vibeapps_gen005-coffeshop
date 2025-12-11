import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { AreaEntity } from '../../../infrastructure/persistence/typeorm/entities/area.entity';
import { TableEntity } from '../../../infrastructure/persistence/typeorm/entities/table.entity';
import { TableReservationEntity } from '../../../infrastructure/persistence/typeorm/entities/table-reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity, TableEntity, TableReservationEntity])],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}

