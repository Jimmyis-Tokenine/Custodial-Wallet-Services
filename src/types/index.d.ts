
export interface Credential {
  id: string,
  password: string,
};

export interface TransactionPayload {
  type: string,
  req_token: string,
};

export interface TransactionResult {
    
};

export type EncryptedWallet = string;
