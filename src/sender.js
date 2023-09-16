require("dotenv").config();
const {
  Client,
  TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");
const { SerialPort, ReadlineParser } = require('serialport')

console.clear();

// Grab the OPERATOR_ID, OPERATOR_KEY and TOPIC_ID from the .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;
const topicId = process.env.TOPIC_ID;

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);

// Create a new SerialPort instance
const portName = 'COM7'; 
const port = new SerialPort({
  path: portName,
  baudRate: 9600, // Set the baud rate of your device
});

// Create a parser to read lines from the serial port
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Open the serial port
port.on('open', () => {
  console.log(`Serial port ${portName} is open.`);
});

// Read data from the serial port
parser.on('data', async (data) => {
  console.log(`Received data: ${data}`);
  // Send message to topic
  let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: `${data}`,
  }).execute(client);
  const getReceipt = await sendResponse.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log("The message transaction status: " + transactionStatus.toString());
});

// Handle errors
port.on('error', (err) => {
  console.error('Error:', err.message);
});

// Close the serial port when the script exits (Ctrl+C)
process.on('SIGINT', () => {
  port.close(() => {
    console.log(`Serial port ${portName} is closed.`);
    client.close()
  });
});
