import { geohashForLocation } from 'geofire-common';
import { GeoPoint, Timestamp } from 'firebase/firestore';

const DATA_MODEL = [
  {
    type: 'temperature',
    value: 0,
    unit: 'C',
    level: 'none',
  },
  {
    type: 'humidity',
    value: 0,
    unit: '%',
    level: 'none',
  },
  {
    type: 'pressure',
    value: 0,
    unit: 'hPa',
    level: 'none',
  },
];


export function averageData(dataToAverage) {
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
          case 'p':
            model[2].value = value;
            break;
        }
      });
  
      model = setLevels(model);
      res([ ...model ]);

    } catch (err) { rej({ err }); }
  });
}


export function createNewMeassure(data) {
  return new Promise((res, rej) => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;

        const hash = geohashForLocation([lat, long]);

        let finalData = {
          city: 'Prueba',
          country: 'Prueba',
          user: 'test-user',
          geo: {
            hash: hash,
            lat: lat,
            lng: long,
          },
          createdAt: Timestamp.now(),
          data: data,
        }
        res({ ...finalData });
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