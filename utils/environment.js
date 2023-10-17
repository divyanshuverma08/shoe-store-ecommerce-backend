const isProduction = process.env.NODE_ENV === "production";

const environment = {
    DB: isProduction ? process.env.DB_PROD : process.env.DB_DEV,
    API_KEY: isProduction ? process.env.API_KEY_PROD : process.env.API_KEY_DEV,
    JWT_SECRET: isProduction ? process.env.JWT_SECRECT_PROD : process.env.JWT_SECRET_DEV,
    CLIENT_URL: isProduction ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV,
    SERVER_URL: isProduction ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV,
    STRIPE_ENDPOINT_SECRET: isProduction ? process.env.STRIPE_ENDPOINT_SECRET_PROD : process.env.STRIPE_ENDPOINT_SECRET_DEV
}

module.exports = environment;