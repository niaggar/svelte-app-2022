import { env } from '$env/dynamic/public'


export const variables : { API_LOCATIONIQ: string, MODE_MICROBIT: string } = {
  API_LOCATIONIQ: env.PUBLIC_API_LOCATIONIQ || '',
  MODE_MICROBIT: env.PUBLIC_MODE_MICROBIT || 'local',
};
