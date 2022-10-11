import type { Meassure } from '$lib/types/meassureType';


export function createRandomValues(): Meassure[] {
  return [
    {
      name: 'temperatura',
      value: random(-200, 400) / 10,
      unit: 'C',
    },
    {
      name: 'humedad',
      value: random(0, 100),
      unit: '%',
    },
    {
      name: 'aire',
      value: random(0, 300) / 100,
      unit: 'volt',
    },
    {
      name: 'sonido',
      value: random(0, 300) / 100,
      unit: 'volt',
    },
    {
      name: 'uv',
      value: random(0, 10),
      unit: 'UV (mW/cm^2)',
    },
  ];
}


function random(min: number, max: number) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}
