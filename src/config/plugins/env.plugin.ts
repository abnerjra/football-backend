import 'dotenv/config';
import * as env from 'env-var';

export const envPlugin = {
    PORT: env.get('PORT').required().asPortNumber(),
    JWT_SECRET: env.get('JWT_SECRET').required().asString(),
    PUBLIC_PATH: env.get('PUBLIC_PATH').required().asString(),
    TIME_ZONE: env.get('TIME_ZONE').required().asString(),
    POSTGRES_DB: env.get('POSTGRES_DB').required().asString(),
    POSTGRES_USER: env.get('POSTGRES_USER').required().asString(),
    POSTGRES_PASSWORD: env.get('POSTGRES_PASSWORD').required().asString(),
    MONGO_URL: env.get('MONGO_URL').asString(),
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').asString(),
    MAILER_SERVICE: env.get('MAILER_SERVICE').asString(),
    MAILER_EMAIL: env.get('MAILER_EMAIL').asString(),
    MAILER_SECRET_KEY: env.get('MAILER_SECRET_KEY').asString(),
    WEBSERVICE_URL: env.get('WEBSERVICE_URL').asString(),
    SEND_MAIL: env.get('SEND_MAIL').default('false').asBool(),
}