require('dotenv').config();


const telegraf = {
  token: process.env.TELEGRAM_TOKEN,
  options: {
    message: {
      parse_mode: 'Markdown',
    },
  },
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
  telegraf,
  umbrello,
  database,
};


export default config;
