import axios from 'axios';
import config from './config';
import logger from './logger';


export const rainCheck = (cityId) => {
  const options = {
    params: {
      cityId,
    },
  };

  return axios.get(`${config.umbrello.apiURL}/weather/forecast`, options)
    .then((res) => {
      const { data } = res;
      // const flag = (data.rain === 'Y');
      return Promise.resolve(data);
    })
    .catch((err) => {
      logger.error(err);
      Promise.reject(err);
    });
};


export const searchCity = (cityName) => {
  const options = {
    params: {
      city: cityName,
    },
  };

  return axios.get(`${config.umbrello.apiURL}/weather/search`, options)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => {
      logger.error(err);
      Promise.reject(err);
    });
};
