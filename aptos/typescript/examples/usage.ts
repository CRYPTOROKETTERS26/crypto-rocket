/**
 * Example: Using Aptos Resource Account SDK with Crypto Rocket
 */

import { AptosResourceAccountSDK } from "../src/AptosResourceAccount";

async function main() {
  // Initialize SDK with testnet
  const sdk = new AptosResourceAccountSDK({
    network: "testnet",
    privateKey: process.env.APTOS_PRIVATE_KEY || "",
  });

  try {
    // Example 1: Get account info
    console.log("📊 Getting account information...");
    const account = sdk.getAccount();
    if (account) {
      console.log(`Account Address: ${account.address}`);
    }

    // Example 2: Create a resource account
    console.log("\n🔧 Creating resource account...");
    const createResponse = await sdk.createResourceAccount("crypto-rocket-seed", undefined);
    console.log(`Result: ${createResponse.success ? "✅ Success" : "❌ Failed"}`);
    console.log(`Message: ${createResponse.message || createResponse.error}`);

    // Example 3: Create a trading pool
    console.log("\n🏊 Creating trading pool...");
    const poolResponse = await sdk.createTradingPool(
      "liquidity-pool-seed",
      "BTC-USDC Pool"
    );
    console.log(`Result: ${poolResponse.success ? "✅ Success" : "❌ Failed"}`);
    console.log(`Message: ${poolResponse.message || poolResponse.error}`);

    // Example 4: Fetch pool info (if pool exists)
    if (poolResponse.success) {
      console.log("\n📈 Fetching pool information...");
      const poolInfo = await sdk.getPoolInfo(
        "0x1"
      );
      if (poolInfo) {
        console.log(`Pool Name: ${poolInfo.poolName}`);
        console.log(`Created At: ${new Date(poolInfo.creationTime * 1000).toISOString()}`);
        console.log(`Total Volume: ${poolInfo.totalVolume}`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
