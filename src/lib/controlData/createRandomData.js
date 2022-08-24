

export function createRandomValues() {
  return [
    {
      type: 'temperatura',
      value: random(-200, 400) / 10,
      unit: 'C',
      level: 'none',
    },
    {
      type: 'humedad',
      value: random(0, 100),
      unit: '%',
      level: 'none',
    },
    {
      type: 'aire',
      value: random(0, 300) / 100,
      unit: 'volt',
      level: 'none',
    },
    {
      type: 'sonido',
      value: random(0, 300) / 100,
      unit: 'volt',
      level: 'none',
    },
    {
      type: 'uv',
      value: random(0, 10),
      unit: 'UV (mW/cm^2)',
      level: 'none',
    },
  ];
}


function random(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}
