import dotenv from 'dotenv'

dotenv.config()

const env = process.env.NODE_ENV || 'development'

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []

const configs = {
  development: {
    port: process.env.PORT || 3000,
    jwtLoginSecret: process.env.JWT_LOGIN_SECRET || 'dev_login_secret',
    jwtInviteSecret: process.env.JWT_INVITE_SECRET || 'dev_invite_secret',
    db: {
      cosmos_endpoint: process.env.COSMOS_DB_URI || 'dev_cosmos_uri',
      cosmos_key: process.env.COSMOS_DB_KEY || 'dev_cosmos_key',
      cosmos_db_id: process.env.COSMOS_DB_ID || 'dev_cosmos_id',
    },
    communicationService: {
      connectionString: process.env.COMMUNICATION_SERVICE_CONNECTION_STRING,
      emailDomainName: process.env.EMAIL_DOMAIN_NAME,
    },
  },
  test: {
    port: 3000,
    jwtLoginSecret: 'test_login_secret',
    jwtInviteSecret: 'test_invite_secret',
    db: {
      cosmos_endpoint: 'test_cosmos_uri',
      cosmos_key: 'test_cosmos_key',
      cosmos_db_id: 'test_cosmos_id',
    },
  },
  production: {
    port: process.env.PORT || 3000,
    jwtLoginSecret: process.env.JWT_LOGIN_SECRET,
    jwtInviteSecret: process.env.JWT_INVITE_SECRET,
    db: {
      cosmos_endpoint: process.env.COSMOS_DB_URI,
      cosmos_key: process.env.COSMOS_DB_KEY,
      cosmos_db_id: process.env.COSMOS_DB_ID,
    },
    communicationService: {
      connectionString: process.env.COMMUNICATION_SERVICE_CONNECTION_STRING,
      emailDomainName: process.env.EMAIL_DOMAIN_NAME,
    },
  },
}

const config = {
  env,
  allowedOrigins,
  ...configs[env],
}

export default config
