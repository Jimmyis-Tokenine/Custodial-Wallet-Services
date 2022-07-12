import { Request, Response } from "express";

// Transaction Request handler
export async function hTransactionRequest(req: ​​​Request, ​res: Response): Promise<void> {
    const { tx } = req.body;​​​​​​​​​​
    if (!tx) {
        res.json({ message: "No transaction procee​ded" });
        return;    
    }
    res.json({ message: "", tx });
};
