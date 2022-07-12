import { TransactionPayload, TransactionResult } from "../../types"

export async function transactionRequestProcessor(tx: TransactionPayload): Promise<[TransactionResult, boolean]> {
  const transactionResult = {};
  return [ transactionResult, false ];
}
