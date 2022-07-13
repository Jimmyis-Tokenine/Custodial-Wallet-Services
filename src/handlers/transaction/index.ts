import { Request, Response } from "express";
import { transactionRequestProcessor } from "../../functions/transaction";

// Transaction Request handler
export async function hTransactionRequest(req: ​​​Request, ​res: Response): Promise<void> {
    const { tx } = req.body;​​​​​​​​​​
    if (!tx) {
        res.json({ message: "No transaction procee​ded" });
        return;
    }
    const result = await transactionRequestProcessor(tx);
    res.json({ message: "", result });
};
