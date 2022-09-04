import { CIRCLE_COLORS, EXTEND_NAMES, getColor, LEVELS, UNITS } from '$lib/controlData/utilDataTypes';
import * as leaf from 'leaflet';
import type { Meassure, Sensor } from '$lib/types/meassureType'
import type { Timestamp } from 'firebase/firestore';

export const createLevelLayer = (sensor: Sensor) => {
  const level = LEVELS[sensor];
  const unit = UNITS[sensor];

  const levelLayer = `
    <div>
      <span>Baja (${level.low} - ${level.normal} ${unit})</span>
      <div class="icon" style="background: ${CIRCLE_COLORS.low}"></div>
    </div>
    <div>
      <span>Normal (${level.normal} - ${level.high} ${unit})</span>
      <div class="icon" style="background: ${CIRCLE_COLORS.normal}"></div>
    </div>
    <div>
      <span>Alta (> ${level.high} ${unit})</span>
      <div class="icon" style="background: ${CIRCLE_COLORS.high}"></div>
    </div>
  `;

  return levelLayer
}

export const createCircle = (meassure: Meassure, lat: number, long: number, createdAt: Timestamp) => {
  const center: leaf.LatLngExpression = [lat, long];
  const { name, value, unit } = meassure;

  let circle = leaf.circle(center, {
    color: getColor(name, value),
    fillColor: getColor(name, value),
    fillOpacity: 0.5,
    radius: 80,
  }).bindPopup(`
    <div class="map-legend">
      <div class="map-legend-title">
        <h3>Medicion de ${EXTEND_NAMES[name]}</h3>
      </div>
      <div class="map-legend-content">
        <p>El valor de esta medicion es de ${value} ${unit}.</p>
        <hr size="1px" color="#777" />
        <p class="map-legend-extra">Tomada el ${createdAt.toDate().toLocaleString()}.</p>
      </div>
    </div>
  `);

  return circle;
}
