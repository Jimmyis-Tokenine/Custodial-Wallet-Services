import Express, { Request, Response } from "express";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const app = Express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.get("/healthcheck", async (req: Request, res: Response) => {
   res.send("OK");
});

app.post("/user/create-wallet", hCreateWallet);
app.get("/user/get-wallet", hGetWallet);
app.post("/tx", hTransactionRequest);

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
};

// Transaction Request handler
async function hTransactionRequest(req: ​​​Request, ​res: Response): Promise<void> {
    const { tx } = req.body;​​​​​​​​​​
    if (!tx) {
        res.json({ message: "No transaction procee​ded" });
        return;    
    }
    res.json({ message: "", tx });
}




async function transactionRequestProcessor(tx: TransactionPayload): Promise<[TransactionResult, boolean]> {
    const transactionResult = {};
    return [ transactionResult, false ];
}

