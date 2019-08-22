require('dotenv').config();


const telegram = {
  token: process.env.TELEGRAM_TOKEN,
};

const umbrello = {
  apiURL: process.env.UMBRELLO_API_URL,
};

const database = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

const config = {
  telegram,
  umbrello,
  database,
};


export default config;
