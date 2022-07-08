import Express, { Request, Response } from "express"

const PORT = process.env.PORT || 3000;
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
async function hCreateWallet(req: Request, res: Response) {
    res.send("OK");
};
