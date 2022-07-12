import * as Ethers from "ethers";
import { SALT, DEFAULT_WALLET_STORE_PATH } from "../../configs/constants";
import { writeFile, readFile } from "../../libs/utils";
import { Credential } from "../../types";

export async function createWallet(credential: Credential): Promise<string> {
  const wallet = Ethers.Wallet.createRandom();
  const encryptedWallet = await encryptWallet(wallet, "password");
  const isSuccess = await storeWallet(wallet.address, encryptedWallet);
  return wallet.address;
};

export async function getWallet(walletAddress: string): Promise<string> {
  const _path = __dirname + DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
  const [ isSuccess, data, err ] = await readFile(_path);
  if (!isSuccess) {
      throw new Error(err);
  }
  const encryptedWallet = JSON.parse(data);
  return "0x" + encryptedWallet.address;
};

async function encryptWallet(wallet: Ethers.ethers.Wallet, password: string): Promise<string> {
  return await wallet.encrypt(SALT + password);
};

async function storeWallet(walletAddress: string, encryptedWallet: string): Promise<boolean> {
  const _path = __dirname + DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
  const [ isSuccess, /* error */ ] = await writeFile(_path, encryptedWallet);
  return isSuccess;
};
