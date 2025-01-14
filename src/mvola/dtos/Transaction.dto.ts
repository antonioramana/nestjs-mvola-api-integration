import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class TransactionDto {
  @ApiProperty({
    description: 'Montant de la transaction',
    example: '15000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le montant est obligatoire.' })
  amount: string;

  @ApiProperty({
    description: 'Devise de la transaction',
    example: 'Ar',
  })
  @IsString()
  @IsNotEmpty({ message: 'La devise est obligatoire.' })
  @Length(2, 3, { message: 'La devise doit avoir entre 2 et 3 caractères.' })
  currency: string;

  @ApiProperty({
    description: 'Description de la transaction',
    example: 'abcpaiment',
  })
  @IsString()
  @IsNotEmpty({ message: 'La description est obligatoire.' })
  descriptionText: string;

  @ApiProperty({
    description: 'Référence de transaction de l\'organisation requérante',
    example: 'TXN12345',
  })
  @IsString()
  @IsNotEmpty({ message: 'La référence est obligatoire.' })
  requestingOrganisationTransactionReference: string;

  @ApiProperty({
    description: 'Numéro de téléphone de débit',
    example: '0343500003',
  })
  @IsNumberString({}, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres.' })
  @IsNotEmpty({ message: 'Le numéro de téléphone de débit est obligatoire.' })
  debitPartyValue: string;

  @ApiProperty({
    description: 'Numéro de téléphone de crédit',
    example: '0343500004',
  })
  @IsNumberString({}, { message: 'Le numéro de téléphone doit contenir uniquement des chiffres.' })
  @IsNotEmpty({ message: 'Le numéro de téléphone de crédit est obligatoire.' })
  creditPartyValue: string;
}
