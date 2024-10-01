import { User } from "@prisma/client";

export class CreateTokenPayloadDto {
  id: number
  firstName: string
  lastName: string
  hobby: string
  isActivated: boolean

  constructor(model: User){
    this.id = model.id;
    this.firstName = model.firstName
    this.lastName = model.lastName
    this.hobby = model.hobby
    this.isActivated = model.isActivated
  }
}