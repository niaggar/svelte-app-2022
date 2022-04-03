const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";


let uBitDevice;
let rxCharacteristic;


export const sendMessageToMicrobit = (message) => {
  try {
    let encoder = new TextEncoder();
    rxCharacteristic.writeValue(encoder.encode(message));
  } catch (error) {
    console.log(error);
  }
}


export const connectToMicrobit = async (action) => {
  try {
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });

    const server = await uBitDevice.gatt.connect();
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    const txCharacteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

    txCharacteristic.startNotifications();
    txCharacteristic.addEventListener("characteristicvaluechanged", action);
    rxCharacteristic = await service.getCharacteristic(UART_RX_CHARACTERISTIC_UUID);

    return true;
  } catch (err) { return false; }
}

