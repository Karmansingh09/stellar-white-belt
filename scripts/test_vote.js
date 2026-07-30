import { Keypair, Contract, TransactionBuilder, Networks, rpc, scValToNative } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'CAHHWOXXL3H3A2YCR2DVXMZDN7VRJL5JTQ5TZ2YNFODF2C6EI6IAQLC4';
const server = new rpc.Server('https://soroban-testnet.stellar.org');

async function testVoteA() {
  const contract = new Contract(CONTRACT_ID);
  const keypair = Keypair.random();
  console.log('Test Account:', keypair.publicKey());
  await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);

  let account = await server.getAccount(keypair.publicKey());

  let voteATx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call('vote_a'))
    .setTimeout(30)
    .build();

  let simVoteA = await server.simulateTransaction(voteATx);
  console.log('simVoteA:', simVoteA.result);

  voteATx = rpc.assembleTransaction(voteATx, simVoteA).build();
  voteATx.sign(keypair);

  let sendRes = await server.sendTransaction(voteATx);
  console.log('sendRes:', sendRes);

  let txStatus;
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    txStatus = await server.getTransaction(sendRes.hash);
    console.log(`Poll ${i+1} status:`, txStatus.status);
    if (txStatus.status !== 'NOT_FOUND') break;
  }

  console.log('Final Tx Status:', txStatus.status);

  account = await server.getAccount(keypair.publicKey());
  let getVotesTx = new TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call('get_votes'))
    .setTimeout(30)
    .build();

  let simRes = await server.simulateTransaction(getVotesTx);
  console.log('Votes after vote_a:', scValToNative(simRes.result.retval));
}

testVoteA().catch(console.error);
