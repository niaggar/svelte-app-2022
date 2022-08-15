import { geohashForLocation } from 'geofire-common';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const DATA_MODEL = [
  {
    type: 'temperatura',
    value: 0,
    unit: 'C',
    level: 'none',
  },
  {
    type: 'humedad',
    value: 0,
    unit: '%',
    level: 'none',
  },
  {
    type: 'aire',
    value: 0,
    unit: 'volt',
    level: 'none',
  },
  {
    type: 'sonido',
    value: 0,
    unit: 'volt',
    level: 'none',
  },
  {
    type: 'uv',
    value: 0,
    unit: 'UV (mW/cm^2)',
    level: 'none',
  },
];


export function averageData(dataToAverage) {
  if (dataToAverage.length === 0) return [];
  let model = JSON.parse(JSON.stringify(DATA_MODEL));

  dataToAverage.forEach((d) => {
    model[0].value += parseFloat(d[0].value);
    model[1].value += parseFloat(d[1].value);
    model[2].value += parseFloat(d[2].value);
  });

  model[0].value = (model[0].value / dataToAverage.length).toFixed(1);
  model[1].value = (model[1].value / dataToAverage.length).toFixed(1);
  model[2].value = (model[2].value / dataToAverage.length).toFixed(1);

  model = setLevels(model);

  return model;
}


export function convertRawData(raw) {
  return new Promise((res, rej) => {
    console.log(raw)
    try {
      let model = JSON.parse(JSON.stringify(DATA_MODEL));

      raw.forEach((d) => {
        let temp = d.split(':');
        let [ type, value ] = temp;
  
        switch (type) {
          case 't':
            model[0].value = value;
            break;
          case 'h':
            model[1].value = value;
            break;
          case 'a':
            model[2].value = value;
            break;
          case 's':
            model[3].value = value;
            break;
          case 'u':
            model[4].value = value;
            break;
        }
      });
  
      model = setLevels(model);
      res([ ...model ]);

    } catch (err) { rej({ err }); }
  });
}


export function createNewMeassure({ data, city, country }) {
  return new Promise((res, rej) => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        const hash = geohashForLocation([lat, long]);
        const user = getAuth().currentUser;

        let finalMessure = {
          city: city,
          country: country,
          user: user.displayName,
          geo: {
            hash: hash,
            lat: lat,
            lng: long,
          },
          createdAt: Timestamp.now(),
          data: data,
        };

        res({ ...finalMessure });
      });

    } catch (err) { rej({ err }); }
  });
}


function setLevels(model) {
  if (model[0].value > 30) {
    model[0].level = 'high';
  } else if (model[0].value < 10) {
    model[0].level = 'low';
  } else {
    model[0].level = 'normal';
  }

  if (model[1].value > 70) {
    model[1].level = 'high';
  } else if (model[1].value < 30) {
    model[1].level = 'low';
  } else {
    model[1].level = 'normal';
  }

  if (model[2].value > 1000) {
    model[2].level = 'high';
  } else if (model[2].value < 800) {
    model[2].level = 'low';
  } else {
    model[2].level = 'normal';
  }

  return model;
}
