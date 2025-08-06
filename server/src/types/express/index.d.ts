export type User = {
  email : string
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}