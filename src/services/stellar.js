import {
  Keypair,
  Account,
  Contract,
  TransactionBuilder,
  Networks,
  rpc,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk';
import {
  isConnected as freighterIsConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from '@stellar/freighter-api';

export const CONTRACT_ID = 'CAHHWOXXL3H3A2YCR2DVXMZDN7VRJL5JTQ5TZ2YNFODF2C6EI6IAQLC4';
export const RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = Networks.TESTNET;

// Create RPC server instance safely
let server;
let contract;

try {
  server = new rpc.Server(RPC_URL);
  contract = new Contract(CONTRACT_ID);
} catch (e) {
  console.error('Failed to initialize Stellar RPC server:', e);
}

/**
 * Check if Freighter extension is installed & connected
 */
export async function checkWalletConnection() {
  try {
    const res = await freighterIsConnected();
    if (res && res.isConnected) {
      const addrRes = await getAddress();
      if (addrRes && addrRes.address && !addrRes.error) {
        return { isConnected: true, address: addrRes.address };
      }
    }
    return { isConnected: false, address: '' };
  } catch (err) {
    console.warn('Freighter connection check notice:', err);
    return { isConnected: false, address: '' };
  }
}

/**
 * Connect wallet by requesting access from Freighter
 */
export async function connectFreighterWallet() {
  try {
    const accessRes = await requestAccess();
    if (accessRes && accessRes.error) {
      throw new Error(accessRes.error.message || accessRes.error || 'Failed to connect Freighter wallet');
    }
    if (accessRes && accessRes.address) {
      return accessRes.address;
    }
    const addrRes = await getAddress();
    if (addrRes && addrRes.address) {
      return addrRes.address;
    }
    throw new Error('No public address returned from Freighter extension');
  } catch (err) {
    console.error('connectFreighterWallet error:', err);
    throw err;
  }
}

/**
 * Read vote count tallies from on-chain Soroban voting contract (get_votes)
 */
export async function fetchVotesOnChain() {
  try {
    if (!server || !contract) {
      return { votesA: 0, votesB: 0, error: 'Stellar RPC client not initialized' };
    }

    // Generate a temporary dummy account for read-only simulation
    const dummyKey = Keypair.random();
    const dummyAccount = new Account(dummyKey.publicKey(), '0');

    const tx = new TransactionBuilder(dummyAccount, {
      fee: '10000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('get_votes'))
      .setTimeout(30)
      .build();

    const simRes = await server.simulateTransaction(tx);
    if (simRes && simRes.result && simRes.result.retval) {
      const votesArray = scValToNative(simRes.result.retval);
      if (Array.isArray(votesArray) && votesArray.length >= 2) {
        return {
          votesA: Number(votesArray[0]),
          votesB: Number(votesArray[1]),
          error: null,
        };
      }
    }
    return { votesA: 0, votesB: 0, error: null };
  } catch (err) {
    console.error('fetchVotesOnChain error:', err);
    return { votesA: 0, votesB: 0, error: err.message || 'Unable to reach Stellar Testnet RPC' };
  }
}

/**
 * Decodes Stellar RPC transaction submission errors into human-readable messages
 */
export function decodeTransactionError(sendRes) {
  if (!sendRes) return 'Unknown transaction error occurred';

  if (sendRes.errorResultXdr) {
    try {
      const parsed = xdr.TransactionResult.fromXDR(sendRes.errorResultXdr, 'base64');
      const resultVal = parsed.result();
      const codeName = resultVal.switch()?.name || String(resultVal.switch());
      console.log('[Stellar Error Decoder] Code:', codeName, 'Result:', resultVal);

      switch (codeName) {
        case 'txBadSeq':
          return 'Transaction sequence number mismatch. Please retry in a few seconds.';
        case 'txInsufficientBalance':
        case 'txInsufficientFee':
          return 'Insufficient XLM balance for transaction gas fees. Please fund your wallet via Friendbot.';
        case 'txBadAuth':
        case 'txBadAuthExtra':
          return 'Transaction signature invalid or network mismatch. Ensure Freighter is set to Stellar Testnet.';
        case 'txFailed':
          return 'Contract execution failed on Stellar Testnet ledger.';
        default:
          return `Stellar RPC Error: ${codeName}`;
      }
    } catch (err) {
      console.warn('[Stellar Error Decoder] Could not parse errorResultXdr:', err);
    }
  }

  if (typeof sendRes === 'string') return sendRes;
  return sendRes.message || JSON.stringify(sendRes);
}

/**
 * Cast vote (vote_a or vote_b) on Soroban smart contract via Freighter wallet signing
 */
export async function submitVoteOnChain(option, userAddress, onStatusUpdate = () => {}) {
  if (!userAddress) {
    throw new Error('Wallet not connected. Please connect Freighter wallet first.');
  }

  if (!server || !contract) {
    throw new Error('Stellar Testnet RPC client is unreachable.');
  }

  const methodName = option === 'a' ? 'vote_a' : 'vote_b';
  console.log(`[Stellar] Initiating vote for method '${methodName}' from address:`, userAddress);

  onStatusUpdate('Fetching account state from Stellar Testnet...');
  let account;
  try {
    account = await server.getAccount(userAddress);
    console.log('[Stellar] Account sequence number:', account.sequence);
  } catch (e) {
    throw new Error(`Account ${userAddress} is not funded on Testnet. Please fund your account via Friendbot first.`);
  }

  onStatusUpdate(`Building transaction for ${methodName}...`);
  const initialTx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(methodName))
    .setTimeout(60)
    .build();

  console.log('[Stellar] Initial transaction built. Preparing via Soroban RPC...');
  onStatusUpdate('Preparing & simulating transaction on Soroban RPC...');

  let preparedTx;
  try {
    preparedTx = await server.prepareTransaction(initialTx);
  } catch (prepErr) {
    console.error('[Stellar] prepareTransaction failed:', prepErr);
    throw new Error(`Transaction simulation/preparation failed: ${prepErr.message || prepErr}`);
  }

  console.log('[Stellar] Prepared transaction object type:', preparedTx.constructor.name);
  if (typeof preparedTx.toXDR !== 'function') {
    throw new Error('Prepared transaction is invalid: toXDR method missing.');
  }

  const unsignedXdr = preparedTx.toXDR();
  console.log('[Stellar] Generated unsigned XDR string (length: ' + unsignedXdr.length + ')');

  onStatusUpdate('Requesting signature from Freighter wallet...');
  let signRes;
  try {
    signRes = await signTransaction(unsignedXdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: userAddress,
    });
  } catch (signErr) {
    console.error('[Stellar] Freighter signing exception:', signErr);
    throw new Error(`Freighter signing rejected: ${signErr.message || signErr}`);
  }

  console.log('[Stellar] Freighter signing result:', signRes);

  const signedXdr = typeof signRes === 'string'
    ? signRes
    : (signRes?.signedTxXdr || signRes?.signedTransaction);

  if (!signedXdr || signRes?.error) {
    const errorMsg = signRes?.error?.message || signRes?.error || 'Transaction signing cancelled by user';
    console.warn('[Stellar] Signing error:', errorMsg);
    throw new Error(errorMsg);
  }

  onStatusUpdate('Submitting signed transaction to Stellar Testnet...');
  console.log('[Stellar] Reconstructing transaction from signed XDR...');
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  console.log('[Stellar] Reconstructed signed tx type:', signedTx.constructor.name);

  const sendRes = await server.sendTransaction(signedTx);
  console.log('[Stellar] sendTransaction response:', sendRes);

  if (sendRes.status === 'ERROR') {
    const decodedError = decodeTransactionError(sendRes);
    console.error('[Stellar] Transaction submission returned ERROR status:', decodedError, sendRes);
    throw new Error(`Transaction submission error: ${decodedError}`);
  }

  const txHash = sendRes.hash;
  console.log('[Stellar] Submitted Tx Hash:', txHash);
  onStatusUpdate(`Transaction submitted! Awaiting ledger confirmation (${txHash.slice(0, 8)}...)...`);

  // Poll for ledger status
  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const txStatus = await server.getTransaction(txHash);
    console.log(`[Stellar] Poll attempt ${i + 1} status:`, txStatus.status);

    if (txStatus.status === rpc.Api.GetTransactionStatus.SUCCESS || txStatus.status === 'SUCCESS') {
      console.log('[Stellar] Transaction CONFIRMED on ledger! Tx Hash:', txHash);
      onStatusUpdate('Transaction confirmed on Stellar Testnet!');
      return {
        success: true,
        hash: txHash,
        explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
      };
    } else if (txStatus.status === rpc.Api.GetTransactionStatus.FAILED || txStatus.status === 'FAILED') {
      console.error('[Stellar] Transaction FAILED on ledger:', txStatus);
      throw new Error(`Transaction failed on ledger execution: ${JSON.stringify(txStatus)}`);
    }
  }

  console.warn('[Stellar] Polling timeout, returning last submitted hash:', txHash);
  return {
    success: true,
    hash: txHash,
    explorerUrl: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
  };
}
