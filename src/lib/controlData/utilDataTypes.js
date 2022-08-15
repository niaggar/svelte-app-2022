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

export const getColor = (type, value) => {
  const tempColor = (value) => {
    if (value > 30) return '#F3643F'
    if (value > 15) return '#F1C24A'
    else return '#28706C'
  }

  const humeColor = (value) => {
    if (value > 75) return '#F3643F'
    if (value > 40) return '#F1C24A'
    else return '#28706C'
  }

  const aireColor = (value) => {
    if (value > 2.5) return '#F3643F'
    if (value > 1.5) return '#F1C24A'
    else return '#28706C'
  }

  const audiColor = (value) => {
    if (value > 2.5) return '#F3643F'
    if (value > 1.8) return '#F1C24A'
    else return '#28706C'
  }

  const uvColor = (value) => {
    if (value > 8) return '#F3643F'
    if (value > 4) return '#F1C24A'
    else return '#28706C'
  }

  switch (type) {
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