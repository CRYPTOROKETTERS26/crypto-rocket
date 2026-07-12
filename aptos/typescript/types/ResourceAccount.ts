/**
 * Resource Account Types for Aptos TypeScript SDK
 */

export interface SignerCapability {
  address: string;
}

export interface Container {
  store: Map<string, SignerCapability>;
}

export interface ResourceAccountConfig {
  network: "mainnet" | "testnet" | "devnet";
  privateKey?: string;
  publicKey?: string;
}

export interface PoolInfo {
  poolName: string;
  creationTime: number;
  totalVolume: number;
  address: string;
}

export interface TransactionResponse {
  success: boolean;
  transactionHash: string;
  message?: string;
  error?: string;
}
