import { Keypair, Account, Contract, TransactionBuilder, Networks, rpc, scValToNative } from '@stellar/stellar-sdk';

const CONTRACT_ID = 'CAHHWOXXL3H3A2YCR2DVXMZDN7VRJL5JTQ5TZ2YNFODF2C6EI6IAQLC4';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const server = new rpc.Server(RPC_URL);

async function testContract() {
  console.log('Testing get_votes on deployed contract:', CONTRACT_ID);
  const contract = new Contract(CONTRACT_ID);

  const keypair = Keypair.random();
  console.log('Funding test account via Friendbot...');
  await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);

  let account = await server.getAccount(keypair.publicKey());

  // Call get_votes (read only)
  let getVotesTx = new TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call('get_votes'))
    .setTimeout(30)
    .build();

  let simRes = await server.simulateTransaction(getVotesTx);
  console.log('get_votes simulation result raw:', simRes.result?.retval);
  if (simRes.result?.retval) {
    const votes = scValToNative(simRes.result.retval);
    console.log('Current Votes (A, B):', votes);
  }

  // Call vote_a (state changing)
  console.log('Executing vote_a on Testnet...');
  let voteATx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call('vote_a'))
    .setTimeout(30)
    .build();

  let simVoteA = await server.simulateTransaction(voteATx);
  voteATx = rpc.assembleTransaction(voteATx, simVoteA).build();
  voteATx.sign(keypair);

  let sendRes = await server.sendTransaction(voteATx);
  console.log('Submitted vote_a tx hash:', sendRes.hash);

  for (let i = 0; i < 30; i++) {
    const status = await server.getTransaction(sendRes.hash);
    if (status.status === rpc.Api.GetTransactionStatus.SUCCESS) {
      console.log('vote_a SUCCESS! Tx hash:', sendRes.hash);
      break;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Fetch updated votes
  account = await server.getAccount(keypair.publicKey());
  let getVotesTx2 = new TransactionBuilder(account, {
    fee: '10000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call('get_votes'))
    .setTimeout(30)
    .build();

  let simRes2 = await server.simulateTransaction(getVotesTx2);
  const updatedVotes = scValToNative(simRes2.result?.retval);
  console.log('Updated Votes (A, B):', updatedVotes);
}

testContract().catch(console.error);
