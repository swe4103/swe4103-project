import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const configs = {
  development: {
    port: process.env.PORT || 3000,
    jwtLoginSecret: process.env.JWT_LOGIN_SECRET || 'dev_login_secret',
    jwtInviteSecret: process.env.JWT_INVITE_SECRET || 'dev_invite_secret',
  },
  test: {
    port: process.env.PORT || 3000,
    jwtLoginSecret: process.env.JWT_LOGIN_SECRET || 'test_login_secret',
    jwtInviteSecret: process.env.JWT_INVITE_SECRET || 'test_invite_secret',
  },
  production: {
    port: process.env.PORT || 3000,
    jwtLoginSecret: process.env.JWT_LOGIN_SECRET,
    jwtInviteSecret: process.env.JWT_INVITE_SECRET,
  },
}

const config = {
  env,
  ...configs[env],
}

export default config
