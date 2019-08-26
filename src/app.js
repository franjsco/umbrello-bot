import Telegraf from 'telegraf';
import config from './config';
import logger from './logger';
import { rainCheck, searchCity } from './api';

import { initUser, setCity, findAssociedCity } from './db';
import {
  searchCityTemplate,
  welcomeTemplate,
  helpTemplate,
  errorTemplate,
  setLocationTemplate,
  weatherTemplate,
  weatherDetailsTemplate,
} from './templates';

const bot = new Telegraf(config.telegraf.token);

bot.start((ctx) => {
  const { id } = ctx.from;
  initUser(id)
    .then(() => ctx.reply(welcomeTemplate(), config.telegraf.options.message))
    .then(() => ctx.reply(helpTemplate(), config.telegraf.options.message))
    .catch(() => ctx.reply(errorTemplate(), config.telegraf.options.message));
});

bot.help((ctx) => ctx.reply(helpTemplate()));


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
        ctx.reply(searchCityTemplate(e), config.telegraf.options.message);
      });
    })
    .catch(() => ctx.reply(errorTemplate(), config.telegraf.options.message));
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
    .catch(() => ctx.reply(errorTemplate(), config.telegraf.options.message));
});


bot.command('/get', (ctx) => {
  const { id } = ctx.from;

  findAssociedCity(id)
    .then((cityId) => rainCheck(cityId))
    .then((json) => {
      if (json.rain === 'Y') {
        ctx.reply(weatherTemplate(), config.telegraf.options.message);
      }

      return json;
    })
    .then((json) => {
      ctx.reply(weatherDetailsTemplate(json), config.telegraf.options.message);
    })
    .catch(() => ctx.reply(errorTemplate(), config.telegraf.options.message));
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
