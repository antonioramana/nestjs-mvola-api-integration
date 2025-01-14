import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MvolaService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = process.env.MVOLA_BASE_URL;
    if (!this.baseUrl) {
      throw new InternalServerErrorException('MVOLA_BASE_URL is not defined in environment variables');
    }
  }

  async authenticate(): Promise<string> {
    const consumerKey = process.env.MVOLA_CONSUMER_KEY;
    const consumerSecret = process.env.MVOLA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new InternalServerErrorException(
        'MVOLA_CONSUMER_KEY or MVOLA_CONSUMER_SECRET is not defined in environment variables',
      );
    }

    const authData = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const headers = {
        Authorization: `Basic ${authData}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
    };

    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('scope', 'EXT_INT_MVOLA_SCOPE');

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/token`, body.toString(), { headers }),
      );

      return response.data.access_token;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to authenticate with MVola API: ${error.message}`,
      );
    }
  }

  async initiateTransaction(token: string, transactionData: any) {
    
    const requestDate = new Date().toISOString();
    const metadata = [
        { key: 'partnerName', value: 'SCompany' },
        { key: 'fc', value: 'USD' },
        { key: 'amountFc', value: '1' }
    ];
    const debitParty = [
        {
            key: 'msisdn',
            value: transactionData.debitPartyValue 
        }
    ];

    const creditParty = [
        {
            key: 'msisdn',
            value: transactionData.creditPartyValue 
        }
    ];


    const fullTransactionData = {
        ...transactionData, 
        requestDate,        
        metadata,           
        debitParty,         
        creditParty         
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      Version: '1.0',
      'X-CorrelationID': uuidv4(), 
      UserLanguage: process.env.USER_LANGUAGE || 'MG',
      UserAccountIdentifier: `msisdn;${process.env.MERCHANT_NUMBER}`,
      partnerName: process.env.PARTNER_NAME || 'MyCompany',
      'Content-Type': 'application/json',
      'X-Callback-URL': process.env.CALLBACK_URL || '', 
      'Cache-Control': 'no-cache',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0`, fullTransactionData, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('Transaction error:', error.response?.data || error.message);
      throw new Error('Failed to initiate transaction');
    }
  }

  async transactionStatus(token: string, serverCorrelationId: string) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Version: '1.0',
      'X-CorrelationID': uuidv4(), 
      UserLanguage: process.env.USER_LANGUAGE || 'MG',
      UserAccountIdentifier: `msisdn;${process.env.MERCHANT_NUMBER}`,
      partnerName: process.env.PARTNER_NAME || 'MyCompany',
      'Content-Type': 'application/json',
      'X-Callback-URL': process.env.CALLBACK_URL || '', 
      'Cache-Control': 'no-cache',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0/status/${serverCorrelationId}`, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('Transaction Status error:', error.response?.data || error.message);
      throw new Error('Failed to show transaction status');
    }
  }

  async transactionDetails(token: string, transID: string) {
    
    const headers = {
      Authorization: `Bearer ${token}`,
      Version: '1.0',
      'X-CorrelationID': uuidv4(), 
      UserLanguage: process.env.USER_LANGUAGE || 'MG',
      UserAccountIdentifier: `msisdn;${process.env.MERCHANT_NUMBER}`,
      partnerName: process.env.PARTNER_NAME || 'MyCompany',
      'Content-Type': 'application/json',
      'X-Callback-URL': process.env.CALLBACK_URL || '', 
      'Cache-Control': 'no-cache',
    };
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0/${transID}`, { headers }),
      );
      return response.data;
    } catch (error) {
      console.error('Transaction Details error:', error.response?.data || error.message);
      throw new Error('Failed to show transaction details');
    }
  }
}
