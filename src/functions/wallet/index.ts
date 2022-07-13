import * as Ethers from "ethers";
import { SALT, DEFAULT_WALLET_STORE_PATH } from "../../configs/constants";
import { writeFile, readFile } from "../../libs/utils";
import { generateTransactionRequestToken } from "../transaction";
import { EncryptedWallet, Credential } from "../../types";

export async function createWallet(credential: Credential): Promise<string> {
  const wallet = Ethers.Wallet.createRandom();
  const encryptedWallet = await encryptWallet(wallet, "password");
  const isSuccess = await storeWallet(wallet.address, encryptedWallet);
  return wallet.address;
};

export async function getWallet(walletAddress: string): Promise<EncryptedWallet | undefined> {
  try {
    const _path = DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
    console.log("getWallet", _path);
    const data = await readFile(_path);
    const transactionRequestToken = await generateTransactionRequestToken(walletAddress);
    const encryptedWallet = JSON.parse(data);
    return transactionRequestToken;
    // return "0x" + encryptedWallet.address;
  } catch (e: any) {
    if (e.code === "ENOENT") throw new Error("Wallet not existed");
  }
};

export async function getEncryptedWallet(walletAddress: string): Promise<EncryptedWallet | undefined> {
  const _path = DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
  try {
    return await readFile(_path);
  } catch (e: any) {
    if (e.code === "ENOENT") throw new Error("Wallet not existed");
  }
};

export async function decryptWallet(encryptedWallet: any, password: string): Promise<Ethers.ethers.Wallet> {
  try {
    return await Ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
  } catch (e: any) {
    throw e;
  }
};

export async function changeWalletPassword(encryptedWallet: any, passwordCurrent: string, passwordNew: string): Promise<[boolean, EncryptedWallet]> {
  try {
    const _ = await decryptWallet(encryptedWallet, passwordCurrent);
    const __ = await encryptWallet(_, passwordNew);
    await storeWallet(_.address, __);
    return [true, __];
  } catch (e: any) {
    return [false, e];
  }
};

async function encryptWallet(wallet: Ethers.ethers.Wallet, password: string): Promise<EncryptedWallet> {
  return await wallet.encrypt(SALT + password);
};

async function storeWallet(walletAddress: string, encryptedWallet: string): Promise<boolean> {
  const _path = DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
  return await writeFile(_path, encryptedWallet);
};
