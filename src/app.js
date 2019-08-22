import Telegraf from 'telegraf';
import config from './config';
import logger from './logger';
import { rainCheck, searchCity } from './api';

import { initUser, setCity, findAssociedCity } from './db';
import {
  searchCityTemplate,
  welcomeTemplate,
  errorTemplate,
  setLocationTemplate,
  weatherTemplate,
  weatherDetailsTemplate,
} from './templates';

const bot = new Telegraf(config.telegram.token);

bot.start((ctx) => {
  const { id, first_name } = ctx.from;
  initUser(id)
    .then(() => ctx.reply(welcomeTemplate(first_name), { parse_mode: 'Markdown' }))
    .catch(() => ctx.reply(errorTemplate, { parse_mode: 'Markdown' }));
});

bot.help((ctx) => ctx.reply('help'));


bot.command('/search', (ctx) => {
  const { text } = ctx.message;
  const cityName = text.split(' ').slice(1, 6).join(' ');

  if (!cityName) {
    ctx.reply('Missing city name. ex: /search Napoli');
    return;
  }

  searchCity(cityName)
    .then((data) => {
      data.forEach((e) => {
        ctx.reply(searchCityTemplate(e), { parse_mode: 'Markdown' });
      });
    })
    .catch(() => ctx.reply(errorTemplate, { parse_mode: 'Markdown' }));
});


bot.command('/set', (ctx) => {
  const { id } = ctx.from;
  const { text } = ctx.message;

  const cityId = Number(text.split(' ').slice(1, 2).join(' ')) || undefined;

  if (!cityId) {
    ctx.reply('Missing city id. (ex: /set 3172394)');
    return;
  }

  setCity(id, cityId)
    .then(() => ctx.reply(setLocationTemplate(cityId)))
    .catch(() => ctx.reply(errorTemplate, { parse_mode: 'Markdown' }));
});


bot.command('/get', (ctx) => {
  const { id } = ctx.from;

  findAssociedCity(id)
    .then((cityId) => rainCheck(cityId))
    .then((json) => {
      if (json.rain === 'Y') {
        ctx.reply(weatherTemplate(), { parse_mode: 'Markdown' });
      }
      return json;
    })
    .then((json) => {
      ctx.reply(weatherDetailsTemplate(json), { parse_mode: 'Markdown' });
    })
    .catch((error) => ctx.reply(error));
});


bot.catch((err) => logger.error(err));

bot.launch();


process
  .on('unhandledRejection', (reason) => logger.error(reason))
  .on('uncaughtException', (err) => {
    logger.error(err);
    process.exit(1);
  })
  .on('SIGINT', () => {
    logger.info('App stopped');
    process.exit(0);
  });
