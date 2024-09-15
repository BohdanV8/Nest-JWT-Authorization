import { PartialType } from '@nestjs/mapped-types';
import { CreateTokenPayloadDto } from './create-token-payload.dto';

export class UpdateTokenPayloadDto extends PartialType(CreateTokenPayloadDto) {}