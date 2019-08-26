export const searchCityTemplate = (data) => (
  `========== 
  *Id*: ${data.id}
  *City*: ${data.name}
  *Country*: ${data.country}`
);


export const welcomeTemplate = () => (
  `*Welcome to umbrello-bot* ☂ ️

An opensource telegram bot to know if you need to take the umbrella.

Made with ❤️ by @frsposito.
  `
);

export const helpTemplate = () => (
  `*umbrello-bot commands*:
/search {city name} - search city.
/set {city id} - set city id.
/get - get forecast.`
);


export const errorTemplate = () => (
  "*Ops*, there's a problem. Check the log."
);


export const setLocationTemplate = (location) => (
  `Location setted: ${location}`
);


export const weatherTemplate = () => (
  'Hey, today take the umbrella ☂️'
);


export const weatherDetailsTemplate = (data) => {
  let msg = `*Information:* 
  City: ${data.city}\n\n`;

  msg += '*Details*:';
  data.list.forEach((e) => {
    msg += `
    🕓 ${new Date(e.date).toLocaleTimeString()}
    ☔ ${e.rain_flag === 'Y' ? 'Yes' : 'No'}
    🌡️ ${e.temperature}
    ----`;
  });

  return msg;
};
