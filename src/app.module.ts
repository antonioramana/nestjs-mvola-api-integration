import { Module } from '@nestjs/common';
import { MvolaModule } from './mvola/mvola.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [MvolaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
