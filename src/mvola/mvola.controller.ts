import { Controller, Post, Body, Get, Headers, Param } from '@nestjs/common';
import { MvolaService } from './mvola.service';
import { TransactionDto } from './dtos/Transaction.dto';

@Controller('mvola')
export class MvolaController {
  constructor(private readonly mvolaService: MvolaService) {}

  @Get('authenticate')
  async authenticate() {
    try {
      const token = await this.mvolaService.authenticate();
      return { token };
    } catch (error) {
      console.error('Error during authentication:', error);
      throw error;
    }
  }
  
  @Post('transaction')
  async createTransaction(
    @Headers('Authorization') authHeader: string,
    @Body() transactionData: TransactionDto,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing or invalid');
    }
    const token = authHeader.split(' ')[1]; 
    return await this.mvolaService.initiateTransaction(token, transactionData);
  }

  @Get('transaction/status/:serverCorrelationId')
  async getTransactiontatus(
    @Headers('Authorization') authHeader: string,
    @Param('serverCorrelationId') serverCorrelationId: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing or invalid');
    }
    const token = authHeader.split(' ')[1]; 
    return await this.mvolaService.transactionStatus(token, serverCorrelationId);
  }

  @Get('transaction/details/:transID')
  async getTransactionDetails(
    @Headers('Authorization') authHeader: string,
    @Param('transID') transID: string,
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization token is missing or invalid');
    }
    const token = authHeader.split(' ')[1]; 
    return await this.mvolaService.transactionDetails(token, transID);
  }

}
