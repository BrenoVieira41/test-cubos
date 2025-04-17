declare namespace Express {
  export interface Request {
    user: import('../src/module/User/UserEntity').CustomJwtPayload;
  }
}
