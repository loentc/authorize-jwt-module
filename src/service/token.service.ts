import jwt from 'jsonwebtoken'

export class TokenService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  generateToken(userId: string) {
    return jwt.sign(
      { user_id: userId }, process.env.TOKEN_KEY, { expiresIn: '1h' }
    )
  }

  generateRefreshToken() {
    return jwt.sign({}, process.env.TOKEN_KEY, { expiresIn: '7d' })
  }
}