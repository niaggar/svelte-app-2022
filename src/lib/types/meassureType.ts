import type { Timestamp } from 'firebase/firestore';


export declare type Sensor = 'aire' | 'humedad' | 'temperatura' | 'sonido' | 'uv';

export declare type Meassure = {
  name: Sensor,
  value: number,
  unit: string,
};

export declare type MeassurePack = {
  city: string,
  country: string,
  user: string,
  geo: {
    hash: string,
    lat: number,
    lng: number,
  },
  createdAt: Timestamp,
  meassures: Meassure[],
};
