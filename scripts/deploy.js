import { Keypair, Account, Operation, TransactionBuilder, Networks, rpc, scValToNative, Address } from '@stellar/stellar-sdk';
import fs from 'fs';
import path from 'path';

const RPC_URL = 'https://soroban-testnet.stellar.org';
const server = new rpc.Server(RPC_URL);

async function deploy() {
  console.log('Generating temporary deployment keypair...');
  const keypair = Keypair.random();
  const publicKey = keypair.publicKey();
  console.log('Deployer Public Key:', publicKey);

  console.log('Funding account via Friendbot...');
  const friendbotRes = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
  if (!friendbotRes.ok) {
    throw new Error(`Friendbot failed: ${await friendbotRes.text()}`);
  }
  console.log('Account funded successfully!');

  let account = await server.getAccount(publicKey);

  const wasmPath = path.resolve('voting-contract/target/wasm32v1-none/release/voting_contract.wasm');
  console.log('Reading WASM file from:', wasmPath);
  const wasmBuffer = fs.readFileSync(wasmPath);

  // 1. Upload WASM
  console.log('Uploading WASM to Testnet...');
  const uploadOp = Operation.uploadContractWasm({ wasm: wasmBuffer });
  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(uploadOp)
    .setTimeout(30)
    .build();

  console.log('Simulating upload transaction...');
  let simRes = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(simRes)) {
    console.error('Simulation error:', simRes);
    throw new Error('Simulation failed for upload');
  }

  tx = rpc.assembleTransaction(tx, simRes).build();
  tx.sign(keypair);

  console.log('Submitting upload transaction...');
  let sendRes = await server.sendTransaction(tx);
  if (sendRes.status === 'ERROR') {
    console.error('Send error:', sendRes);
    throw new Error('Failed to send upload transaction');
  }

  console.log('Waiting for upload confirmation... Hash:', sendRes.hash);
  let statusRes = await pollTxStatus(sendRes.hash);
  console.log('Upload status:', statusRes.status);

  const nativeVal = scValToNative(simRes.result.retval);
  const wasmHashBuf = Buffer.isBuffer(nativeVal) ? nativeVal : (nativeVal._value || nativeVal.value ? nativeVal.value() : nativeVal);
  const wasmHashHex = Buffer.isBuffer(wasmHashBuf) ? wasmHashBuf.toString('hex') : String(wasmHashBuf);
  console.log('WASM Hash Hex:', wasmHashHex);

  // 2. Create Contract
  account = await server.getAccount(publicKey);
  console.log('Creating contract instance on Testnet...');
  const createOp = Operation.createCustomContract({
    address: new Address(publicKey),
    wasmHash: Buffer.from(wasmHashHex, 'hex'),
  });

  let createTx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(createOp)
    .setTimeout(30)
    .build();

  console.log('Simulating create contract transaction...');
  let createSimRes = await server.simulateTransaction(createTx);
  if (rpc.Api.isSimulationError(createSimRes)) {
    console.error('Simulation error:', createSimRes);
    throw new Error('Simulation failed for create contract');
  }

  const deployedContractId = Address.fromScVal(createSimRes.result.retval).toString();
  console.log('Contract ID from simulation:', deployedContractId);

  createTx = rpc.assembleTransaction(createTx, createSimRes).build();
  createTx.sign(keypair);

  console.log('Submitting create contract transaction...');
  let createSendRes = await server.sendTransaction(createTx);
  if (createSendRes.status === 'ERROR') {
    console.error('Send error:', createSendRes);
    throw new Error('Failed to send create contract transaction');
  }

  console.log('Waiting for create contract confirmation... Hash:', createSendRes.hash);
  let createStatusRes = await pollTxStatus(createSendRes.hash);
  console.log('Create status:', createStatusRes.status);

  console.log('==================================================');
  console.log('SUCCESS! DEPLOYED CONTRACT ID:', deployedContractId);
  console.log('Transaction Hash:', createSendRes.hash);
  console.log('Stellar Expert Contract Explorer: https://stellar.expert/explorer/testnet/contract/' + deployedContractId);
  console.log('Stellar Expert Tx Explorer: https://stellar.expert/explorer/testnet/tx/' + createSendRes.hash);
  console.log('==================================================');
}

function getWasmHashFromStatus(statusRes) {
  try {
    return statusRes.returnValue;
  } catch (e) {
    return null;
  }
}

async function pollTxStatus(hash) {
  for (let i = 0; i < 30; i++) {
    const status = await server.getTransaction(hash);
    if (status.status !== rpc.Api.GetTransactionStatus.NOT_FOUND) {
      if (status.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        return status;
      } else if (status.status === rpc.Api.GetTransactionStatus.FAILED) {
        throw new Error(`Transaction failed: ${JSON.stringify(status)}`);
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('Transaction polling timed out');
}

deploy().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
