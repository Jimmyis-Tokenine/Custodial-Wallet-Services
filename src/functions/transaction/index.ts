import * as ethers from "ethers";
import { TransactionPayload, TransactionResult, EncryptedWallet } from "../../types";
import { DEFAULT_TX_REQ_TOKEN_STORE_PATH } from "../../configs/constants";
import { readFile, writeFile } from "../../libs/utils";
import { createHash } from "crypto";
import { getEncryptedWallet, decryptWallet } from "../wallet";
import * as contracts from "../../configs/contracts";


interface Contract extends ethers.ethers.Contract {};

interface ContractOps {
  method: Function | string,
  arguments: [any],
  execute: Function,

};

const CHAIN_CONFIGS = {
  RPCS: [
    "https://data-seed-prebsc-1-s3.binance.org:8545",
  ],
};

const GAS_SUFFICIENCY_OFFSET = ethers.BigNumber.from(1000000000); // Use value from most gas used transaction.


export async function transactionRequestProcessor(txReq: TransactionPayload): Promise<[boolean, TransactionResult]> {
  const [ isSuccess, result, error ] = await transactionProcessSelector(txReq);

  return [ result, isSuccess ];
}

const availableTransactionTypes = new Map<string, Function>([
  ["SAMPLE", sampleTransaction],
]);

async function transactionProcessSelector(txReq: TransactionPayload): Promise<[boolean, any, any]> {
  const { type } = txReq;
  console.log(txReq);
  if (!availableTransactionTypes.has(type)) {
    return [ false, null, new Error("Transaction type not available") ];
  }
  const tx = availableTransactionTypes.get(type);

  return await tx!(transactionRequestValidator(txReq));
};

function transactionRequestValidator(txReq: TransactionPayload) {
  const txReq_  = txReq;
  // TODO: Add criterias to check that's a valid payload.
  return txReq_;
};

export async function getWalletByRequestToken(requestToken: string): Promise<EncryptedWallet | void> {
    try {
        const _path = DEFAULT_TX_REQ_TOKEN_STORE_PATH + requestToken.toLowerCase();
        const data = await readFile(_path);
        const txReqToken = JSON.parse(data);
        return await getEncryptedWallet(txReqToken.wallet_address);
    } catch (e: any) {
        console.log("ERROR", e);
        if (e?.code === "ENOENT") throw new Error("Wallet not existed");
    }
};

export async function generateTransactionRequestToken(wallet_address: string): Promise<string> {
  const input = wallet_address.toLowerCase();
  const token = createHash('sha256').update(input).digest('hex');
  const isStoreSuccess = await storeTransactionRequestToken(token, { wallet_address });
  return token;
};

async function storeTransactionRequestToken(token: string, data: any): Promise<boolean> {
    const _path = DEFAULT_TX_REQ_TOKEN_STORE_PATH + token;
    try {
      return await writeFile(_path, JSON.stringify(data));
    } catch (e) {
        throw (e);
    }
};

function getCurrentProvider(rpcOrder = 0) {
  return CHAIN_CONFIGS.RPCS[rpcOrder]
};

async function sampleTransaction(txReq: TransactionPayload): Promise<[boolean, any, any]> {
  const transactionResult: any = {};
  const { req_token } = txReq;

  // Get Wallet (Signer)
  try {
    const encrpyptedWallet = await getWalletByRequestToken(req_token);
    const wallet = await decryptWallet(encrpyptedWallet, "passwordx");
    const provider = ethers.getDefaultProvider(getCurrentProvider());
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
  
    transactionResult.wallet = wallet.address;
    transactionResult.balance = balance.toString();
  
    // Get Contract Instance
    const contract1Instance = new ethers.Contract(contracts.tokenA.address, contracts.tokenA.abi, signer);
    
    // Get Requires Condition
    // const estimateGasPrice = await provider.getGasPrice();
    const estimateGasPrice = await contract1Instance.estimateGas.transfer("0xd0BE34550AC47e616B7220564605BA00912A5FeF", ethers.utils.formatUnits("1", "wei"));
    console.log("Estimate Gas Price", estimateGasPrice.toString());
  
    const isSufficientGas = await checkGasSufficiency(balance, [estimateGasPrice]);
    console.log("Is Gas Sufficient", isSufficientGas);
    if (!isSufficientGas) {
  
    }
    
    // Call Contract's Methods
    const contract1Name = await contract1Instance.name();
  
    const tx = await contract1Instance.transfer("0xd0BE34550AC47e616B7220564605BA00912A5FeF", ethers.utils.formatUnits("1", "wei"));
    transactionResult.tx = tx;
    const txReceipt = await tx.wait();
    transactionResult.txReceipt = txReceipt;
  
    transactionResult.contracts = [{ address: contract1Instance.address, name: contract1Name }];
  
    // TODOs:
    // Save transaction log
    // ... Do further methods.
    // In case of failure... Create a resumable task...
    // Reports
    // Make all above to be a simple/reusable function.
    return [ true, transactionResult, null ];
  } catch (e: any) {
    console.log(e);
    return [ false, null, e ];
  }
};

export function checkGasSufficiency(balance: ethers.BigNumber, gasPriceEstimations: [ethers.BigNumber]) {
  const totalGasPriceEstimation = gasPriceEstimations.reduce((p: ethers.BigNumber, v: ethers.BigNumber) => p.add(v));
  return balance.add(GAS_SUFFICIENCY_OFFSET).gt(totalGasPriceEstimation);
};

export async function buyNFT() {

};

export async function swapToken() {

};
