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
app.get("/user/get-wallet", hGetWallet);

app.listen(PORT, (): void => console.log(`App is listening at port ${PORT}`));

/* 
 ////////////////////////////// TEMP //////////////////////////////
*/

// Create Wallet handler
async function hCreateWallet(req: Request, res: Response): Promise<void> {
    const wallet_address = await createWallet();
    res.json({ message: "Wallet created", data: { wallet_address } });
};

async function hGetWallet(req: Request, res: Response): Promise<void> {
    const walletAddress = (req.query.id as string);
    if (!walletAddress) {
        res.json({ message: "Wallet address not provided" });
    }
    const wallet = await getWallet(walletAddress);
    res.json({ message: "Wallet found", data: { wallet } });
}

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

async function getWallet(walletAddress: string): Promise<string> {
    const _path = __dirname + DEFAULT_WALLET_STORE_PATH + walletAddress.toLowerCase();
    const [ isSuccess, data, err ] = await readFile(_path);
    if (!isSuccess) {
        throw new Error(err);
    }
    const encryptedWallet = JSON.parse(data);
    return "0x" + encryptedWallet.address;
};

function writeFile(path: string, data: string): Promise<[boolean, string | null | undefined]> {
    return new Promise((resolve, reject) => {
        const _dir = path.split("/").slice(0, -1).join("/");
        makeDir(_dir)
        .then((r: boolean) => {
            fs.writeFile(path, data, (err: NodeJS.ErrnoException | null) => {
                if (err) reject([ false, err ]);
                resolve( [ true, null ]);
            });
        })
        .catch((e: NodeJS.ErrnoException) => reject([false, e]));
    });
};

function readFile(path: string): Promise<[boolean, string, string | undefined]> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
            if (err) reject([ false, "", err ]);
            resolve( [ true, data.toString(), undefined ]);
        });
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
