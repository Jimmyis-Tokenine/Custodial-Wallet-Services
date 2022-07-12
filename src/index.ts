import Express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { hCreateWallet, hGetWallet } from "./handlers/wallet";
import { hTransactionRequest } from "./handlers/transaction";

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
