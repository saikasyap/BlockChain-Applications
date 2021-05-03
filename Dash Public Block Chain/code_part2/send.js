const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  wallet: {
    mnemonic: 'tip rabbit soon wage judge weekend thunder employ reject dutch today artist',
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
    },
  },
};
const client = new Dash.Client(clientOpts);

const sendFunds = async () => {
  const account = await client.getWalletAccount();

  const transaction = account.createTransaction({
    recipient: 'yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr', // Testnet2 faucet
    satoshis: 100000000, // 1 Dash
  });
  return account.broadcastTransaction(transaction);
};

sendFunds()
  .then((d) => console.log('Transaction broadcast!\nTransaction ID:', d))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());

// Handle wallet async errors
client.on('error', (error, context) => {
  console.error(`Client error: ${error.name}`);
  console.error(context);
});
