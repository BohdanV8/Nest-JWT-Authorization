export class Token {
  private userId: number;
  private refreshToken: string;

  constructor(userId: number, refreshToken: string) {
    this.userId = userId
    this.refreshToken = refreshToken
  }
}
