import { geohashForLocation } from 'geofire-common';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { DATA_MODEL } from './utilDataTypes';
import type { Meassure, MeassurePack } from '$lib/types/meassureType';



export function averageData(dataToAverage: (Meassure[])[]) {
  if (dataToAverage.length === 0) return [];
  let model: Meassure[] = JSON.parse(JSON.stringify(DATA_MODEL));


  dataToAverage.forEach((d: Meassure[]) => {
    model[0].value += d[0].value;
    model[1].value += d[1].value;
    model[4].value += d[2].value;
    model[3].value += d[2].value;
    model[2].value += d[2].value;
  });

  model[0].value = parseFloat((model[0].value / dataToAverage.length).toFixed(1));
  model[1].value = parseFloat((model[1].value / dataToAverage.length).toFixed(1));
  model[2].value = parseFloat((model[2].value / dataToAverage.length).toFixed(1));
  model[2].value = parseFloat((model[3].value / dataToAverage.length).toFixed(1));
  model[2].value = parseFloat((model[4].value / dataToAverage.length).toFixed(1));

  return model;
}



export function convertRawData(raw: string[]): Meassure[] {
    let model = JSON.parse(JSON.stringify(DATA_MODEL)) as Meassure[];

    raw.forEach((d) => {
      let temp = d.split(':');
      let [ type, value ] = temp;

      switch (type) {
        case 't':
          model[0].value = parseFloat(value);
          break;
        case 'h':
          model[1].value = parseFloat(value);
          break;
        case 'a':
          model[2].value = parseFloat(value);
          break;
        case 's':
          model[3].value = parseFloat(value);
          break;
        case 'u':
          model[4].value = parseFloat(value);
          break;
      }
    });

    return model;
}


export function createNewMeassure(meassures: Meassure[], city: string, country: string, lat: number, long: number) {
  const hash = geohashForLocation([lat, long]);
  const user = getAuth().currentUser;

  let finalMessure: MeassurePack = {
    city: city,
    country: country,
    user: user?.displayName || '',
    geo: {
      hash: hash,
      lat: lat,
      lng: long,
    },
    createdAt: Timestamp.now(),
    meassures: meassures,
  };

  return finalMessure;
}
