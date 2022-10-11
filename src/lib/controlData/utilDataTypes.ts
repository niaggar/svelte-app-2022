import type { Meassure, Sensor } from '$lib/types/meassureType';

export const UNITS = {
  aire: 'volt',
  humedad: '%',
  temperatura: 'C',
  sonido: 'volt',
  uv: 'UV (mW/cm^2)'
}

export const DATA_MODEL: Meassure[] = [
  {
    name: 'temperatura',
    value: 0,
    unit: UNITS.temperatura,
  },
  {
    name: 'humedad',
    value: 0,
    unit: UNITS.humedad,
  },
  {
    name: 'aire',
    value: 0,
    unit: UNITS.aire,
  },
  {
    name: 'sonido',
    value: 0,
    unit: UNITS.sonido,
  },
  {
    name: 'uv',
    value: 0,
    unit: UNITS.uv,
  },
];

export const CIRCLE_COLORS = {
  low: '#28706C',
  normal: '#F1C24A',
  high: '#F3643F',
};

export const EXTEND_NAMES = {
  aire: 'Contaminacion atmosferica',
  humedad: 'Humedad del aire',
  temperatura: 'Temperatura',
  sonido: 'Contaminacion auditiva',
  uv: 'Radiacion UV'
}

export const LEVELS = {
  'temperatura': {
    'low': -25,
    'normal': 15,
    'high': 30,
  },
  'humedad': {
    'low': 0,
    'normal': 50,
    'high': 70,
  },
  'aire': {
    'low': 0,
    'normal': 1.5,
    'high': 2.5,
  },
  'sonido': {
    'low': 0,
    'normal': 1.8,
    'high': 2.5,
  },
  'uv': {
    'low': 0,
    'normal': 4,
    'high': 8,
  },
}

export const getColor = (name: Sensor, value: number) => {
  const tempColor = (value: number) => {
    if (value > LEVELS.temperatura.high) return '#F3643F'
    if (value > LEVELS.temperatura.normal) return '#F1C24A'
    else return '#28706C'
  }

  const humeColor = (value: number) => {
    if (value > LEVELS.humedad.high) return '#F3643F'
    if (value > LEVELS.humedad.normal) return '#F1C24A'
    else return '#28706C'
  }

  const aireColor = (value: number) => {
    if (value > LEVELS.aire.high) return '#F3643F'
    if (value > LEVELS.aire.normal) return '#F1C24A'
    else return '#28706C'
  }

  const audiColor = (value: number) => {
    if (value > LEVELS.sonido.high) return '#F3643F'
    if (value > LEVELS.sonido.normal) return '#F1C24A'
    else return '#28706C'
  }

  const uvColor = (value: number) => {
    if (value > LEVELS.uv.high) return '#F3643F'
    if (value > LEVELS.uv.normal) return '#F1C24A'
    else return '#28706C'
  }

  switch (name) {
    case 'temperatura':
      return tempColor(value)
    case 'humedad':
      return humeColor(value)
    case 'aire':
      return aireColor(value)
    case 'sonido':
      return audiColor(value)
    case 'uv':
      return uvColor(value)
  }
}
