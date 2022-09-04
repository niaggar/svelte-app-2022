import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const BluetoothStore: Writable<BluetoothRemoteGATTCharacteristic | null> = writable();
