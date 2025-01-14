import { Module } from '@nestjs/common';
import { MvolaService } from './mvola.service';
import { MvolaController } from './mvola.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [MvolaController],
    providers: [MvolaService],
  })
  export class MvolaModule {}
  