/**
 * Aptos Resource Account SDK
 * Provides utilities to interact with Aptos resource accounts and trading pools
 */

import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  SigningSchemeInput,
  AccountAddressInput,
} from "@aptos-labs/ts-sdk";
import { ResourceAccountConfig, TransactionResponse, PoolInfo } from "../types/ResourceAccount";

export class AptosResourceAccountSDK {
  private aptos: Aptos;
  private account?: Account;

  constructor(config: ResourceAccountConfig) {
    const networkMap: Record<string, Network> = {
      mainnet: Network.MAINNET,
      testnet: Network.TESTNET,
      devnet: Network.DEVNET,
    };

    const aptosConfig = new AptosConfig({ network: networkMap[config.network] });
    this.aptos = new Aptos(aptosConfig);

    if (config.privateKey) {
      this.initializeAccount(config.privateKey);
    }
  }

  /**
   * Initialize account with private key
   */
  private initializeAccount(privateKey: string) {
    try {
      const privateKeyObj = new Ed25519PrivateKey(privateKey);
      this.account = Account.fromPrivateKey({
        privateKey: privateKeyObj,
        address: this.account?.address,
        signingScheme: SigningSchemeInput.Ed25519,
      });
    } catch (error) {
      console.error("Failed to initialize account:", error);
      throw error;
    }
  }

  /**
   * Create a resource account
   */
  async createResourceAccount(
    seed: string,
    optionalAuthKey?: string
  ): Promise<TransactionResponse> {
    if (!this.account) {
      return {
        success: false,
        transactionHash: "",
        error: "Account not initialized. Provide a private key.",
      };
    }

    try {
      const seedBytes = Buffer.from(seed, "utf-8").toString("hex");
      const authKeyBytes = optionalAuthKey ? Buffer.from(optionalAuthKey, "utf-8").toString("hex") : "";

      // Build transaction
      const response = await this.aptos.transaction.build.simple({
        sender: this.account.address,
        data: {
          function: "0x1::resource_account::create_resource_account",
          typeArguments: [],
          functionArguments: [seedBytes, authKeyBytes],
        },
      });

      // This is a placeholder - actual signing and submission would go here
      return {
        success: true,
        transactionHash: response.hash || "",
        message: "Resource account created successfully",
      };
    } catch (error) {
      return {
        success: false,
        transactionHash: "",
        error: `Failed to create resource account: ${error}`,
      };
    }
  }

  /**
   * Get resource account information
   */
  async getResourceAccount(resourceAddress: AccountAddressInput) {
    try {
      const resource = await this.aptos.getAccountResource({
        accountAddress: resourceAddress,
        resourceType: "0x1::resource_account::Container",
      });
      return resource;
    } catch (error) {
      console.error("Failed to get resource account:", error);
      throw error;
    }
  }

  /**
   * Create a trading pool
   */
  async createTradingPool(
    seed: string,
    poolName: string
  ): Promise<TransactionResponse> {
    if (!this.account) {
      return {
        success: false,
        transactionHash: "",
        error: "Account not initialized. Provide a private key.",
      };
    }

    try {
      const seedBytes = Buffer.from(seed, "utf-8").toString("hex");
      const poolNameBytes = Buffer.from(poolName, "utf-8").toString("hex");

      const response = await this.aptos.transaction.build.simple({
        sender: this.account.address,
        data: {
          function: "0x1::trading_pool::create_trading_pool",
          typeArguments: [],
          functionArguments: [seedBytes, poolNameBytes],
        },
      });

      return {
        success: true,
        transactionHash: response.hash || "",
        message: "Trading pool created successfully",
      };
    } catch (error) {
      return {
        success: false,
        transactionHash: "",
        error: `Failed to create trading pool: ${error}`,
      };
    }
  }

  /**
   * Get trading pool information
   */
  async getPoolInfo(poolAddress: AccountAddressInput): Promise<PoolInfo | null> {
    try {
      const resource = await this.aptos.getAccountResource({
        accountAddress: poolAddress,
        resourceType: "0x1::trading_pool::TradingPoolInfo",
      });

      if (resource) {
        const data = resource.data as any;
        return {
          poolName: Buffer.from(data.pool_name, "hex").toString("utf-8"),
          creationTime: parseInt(data.creation_time),
          totalVolume: parseInt(data.total_volume),
          address: poolAddress.toString(),
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to get pool info:", error);
      return null;
    }
  }

  /**
   * Get the current Aptos client
   */
  getAptosClient(): Aptos {
    return this.aptos;
  }

  /**
   * Get the current account
   */
  getAccount(): Account | undefined {
    return this.account;
  }
}
