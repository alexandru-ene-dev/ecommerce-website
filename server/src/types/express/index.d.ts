export type User = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  favorites: number[],
  iat?: number,
  exp?: number
}

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}