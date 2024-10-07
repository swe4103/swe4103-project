import dotenv from 'dotenv'

dotenv.config()

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtLoginSecret: process.env.JWT_LOGIN_SECRET,
  jwtInviteSecret: process.env.JWT_INVITE_SECRET,
  // add more things over time
}
export default config
