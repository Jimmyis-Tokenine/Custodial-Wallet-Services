import Express, { Request, Response } from "express";
import * as Ethers from "ethers";
import * as fs from "fs";

const PORT = process.env.PORT || 3000;
const SALT = "";
const DEFAULT_WALLET_STORE_PATH = "/../temp/wallets/";
const app = Express();
 
app.get("/healthcheck", async (req: Request, res: Response) => {
   res.send("OK");
});

app.post("/user/create-wallet", hCreateWallet);

app.listen(PORT, (): void => console.log(`App is listening at port ${PORT}`));

/* 
 ////////////////////////////// TEMP //////////////////////////////
*/

// Create Wallet handler
async function hCreateWallet(req: Request, res: Response): Promise<void> {
    const wallet_address = await createWallet();
    res.json({ message: "Wallet created", data: { wallet_address } });
};

async function createWallet(): Promise<string> {
    const wallet = Ethers.Wallet.createRandom();
    const encryptedWallet = await encryptWallet(wallet, "password");
    const isSuccess = await storeWallet(wallet.address, encryptedWallet);
    return wallet.address;
};

async function encryptWallet(wallet: Ethers.ethers.Wallet, password: string): Promise<string> {
    return await wallet.encrypt(SALT + password);
};

async function storeWallet(walletAddress: string, encryptedWallet: string): Promise<boolean> {
    const _path = __dirname + DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
    const [ isSuccess, /* error */ ] = await writeFile(_path, encryptedWallet);
    return isSuccess;
};

function writeFile(path: string, data: string): Promise<[boolean, string | null | undefined]> {
  return new Promise((resolve, reject) => {
    const _dir = path.split("/").slice(0, -1).join("/");
    makeDir(_dir)
    .then((r: boolean) => {
      fs.writeFile(path, data, (err: NodeJS.ErrnoException | null) => {
        if (err) reject([ false, err ]);
        resolve( [true, null ]);
      });
    })
    .catch((e: NodeJS.ErrnoException) => reject([false, e]));
  });
};

function makeDir(path: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, { recursive: true }, (err: NodeJS.ErrnoException | null) => {
      if (err) reject(err);
      resolve(true);
    });
  });
};
