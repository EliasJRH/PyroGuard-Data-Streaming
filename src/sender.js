console.clear();
require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;
const topicId = process.env.TOPIC_ID;

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);

async function submitFirstMessage() {
  while (true){
    // user input js
    console.log("Waiting 10 seconds")
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Send message to topic
    let sendResponse = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message: "Hello, HCS!",
    }).execute(client);
    const getReceipt = await sendResponse.getReceipt(client);

    // Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus.toString());
  }  
}

submitFirstMessage();