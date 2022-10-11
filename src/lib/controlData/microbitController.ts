import { BluetoothStore } from '$lib/stores/bluetoothStore';
import { get } from 'svelte/store';


const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

let uBitDevice: BluetoothDevice;
let rxCharacteristic: BluetoothRemoteGATTCharacteristic;

export const sendMessageToMicrobit = (message: string) => {
  try {
    let encoder = new TextEncoder();
    let bluetoothService = get(BluetoothStore);

    if (bluetoothService) {
      console.log('Sending message to microbit: ' + message);
      bluetoothService.writeValue(encoder.encode(message));
    }
  } catch (error) {
    console.log(error);
  }
};

export const connectToMicrobit = async (action: (e: Event) => any) => {
  try {
    alert('Connecting to microbit...');

    console.log(navigator.bluetooth);

    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'BBC micro:bit' }],
      optionalServices: [UART_SERVICE_UUID],
    });

    alert('Connected to ');

    if (uBitDevice.gatt == undefined) return;

    const server = await uBitDevice.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    const txCharacteristic = await service?.getCharacteristic(
      UART_TX_CHARACTERISTIC_UUID
    );

    txCharacteristic.startNotifications();
    txCharacteristic.addEventListener('characteristicvaluechanged', action);
    rxCharacteristic = await service.getCharacteristic(UART_RX_CHARACTERISTIC_UUID);
    BluetoothStore.set(rxCharacteristic);

    return true;
  } catch (err) {
    alert('Error: ' + err);
    return false;
  }
};
