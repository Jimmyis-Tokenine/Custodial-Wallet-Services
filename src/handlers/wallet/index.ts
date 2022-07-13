import { Request, Response } from "express";
import { createWallet, getWallet } from "../../functions/wallet";

// Create Wallet handler
export async function hCreateWallet(req: Request, res: Response): Promise<void> {
  const { email: id, password } = req.body;
  const wallet_address = await createWallet({ id, password });
  res.json({ message: "Wallet created", data: { wallet_address } });
};

// Get Wallet handler
export async function hGetWallet(req: Request, res: Response): Promise<void> {
  const walletAddress = (req.query.id as string);
  if (!walletAddress || walletAddress === "") {
      res.json({ message: "Wallet address not provided" });
  }
  const wallet = await getWallet(walletAddress);
  res.json({ message: "Wallet found", data: { wallet } });
};
