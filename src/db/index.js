import mongoose from 'mongoose';

import UserModel from './user.model';
import logger from '../logger';
import config from '../config';


const options = {
  useNewUrlParser: true,
  user: config.database.user,
  pass: config.database.password,
};

mongoose.connect(config.database.host, options);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

db.on('error', (err) => logger.error(err));
db.once('open', () => logger.info('Database connected'));


export const initUser = (id) => (
  new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate({ id }, { id }, { upsert: true }, (err, doc) => {
      if (err) {
        logger.error(err);
        reject(err);
      }

      resolve(doc);
    });
  })
);


export const setCity = (userId, cityId) => {
  const document = {
    city: {
      id: cityId,
    },
  };

  return new Promise((resolve, reject) => {
    UserModel.findOneAndUpdate({ id: userId }, document, { new: true }, (err, doc) => {
      if (err) {
        logger.error(err);
        reject(err);
      }

      resolve(doc);
    });
  });
};


export const findAssociedCity = (id) => (
  new Promise((resolve, reject) => {
    UserModel.findOne({ id }, (err, doc) => {
      if (err) {
        logger.error(err);
        reject(err);
      }

      resolve(doc.city.id);
    });
  })
);


export { UserModel };
