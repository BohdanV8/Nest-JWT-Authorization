import { User } from "@prisma/client";

export class CreateTokenPayloadDto {
  id: number
  isActivated: boolean
  role: string

  constructor(model: User){
    this.id = model.id;
    this.isActivated = model.isActivated
    this.role = model.role
  }
}