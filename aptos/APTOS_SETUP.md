# Aptos Integration Setup Guide for Crypto Rocket

## Overview
This guide helps you set up and use the Aptos integration for Crypto Rocket, including resource accounts and trading pool management.

## Prerequisites

1. **Aptos CLI**
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Node.js & npm** (for TypeScript SDK)
   ```bash
   node --version  # v18+ recommended
   npm --version
   ```

3. **Move language basics** - Familiarize yourself with Move smart contracts

## Project Structure

```
aptos/
├── Move.toml                 # Move package configuration
├── sources/
│   ├── resource_account.move # Core resource account module
│   └── trading_pool.move     # Trading pool implementation
├── typescript/
│   ├── src/
│   │   └── AptosResourceAccount.ts  # SDK implementation
│   ├── types/
│   │   └── ResourceAccount.ts       # TypeScript types
│   ├── examples/
│   │   └── usage.ts                 # Usage examples
│   ├── package.json
│   └── tsconfig.json
└── APTOS_SETUP.md            # This file
```

## Getting Started

### 1. Build Move Modules

```bash
cd aptos
aptos move compile
```

**Expected Output:**
```
Compiling, may take a moment...
Compiled successfully
```

### 2. Run Tests

```bash
aptos move test
```

**Test Cases Included:**
- `test_create_account_and_retrieve_cap` - Basic resource account creation
- `test_create_account_and_retrieve_cap_resource_address_does_not_exist` - Error handling
- `with_coin` - Funding resource accounts with AptosCoin

### 3. Set Up TypeScript SDK

```bash
cd aptos/typescript
npm install
```

### 4. Run Examples

```bash
cd aptos/typescript
npm run example
```

Or for development with auto-reload:
```bash
npm run dev
```

## Usage Examples

### Move: Create a Resource Account

```move
use crypto_rocket::resource_account;

public entry fun initialize_pool(creator: &signer) {
    let seed = b"my-pool-seed";
    resource_account::create_resource_account(creator, seed, vector::empty());
}
```

### TypeScript: Create Trading Pool

```typescript
import { AptosResourceAccountSDK } from "./src/AptosResourceAccount";

const sdk = new AptosResourceAccountSDK({
    network: "testnet",
    privateKey: process.env.APTOS_PRIVATE_KEY,
});

const response = await sdk.createTradingPool(
    "btc-usdc-pool",
    "Bitcoin-USDC Liquidity Pool"
);

console.log(response.message);
```

### TypeScript: Fetch Pool Information

```typescript
const poolInfo = await sdk.getPoolInfo("0x1234...");
if (poolInfo) {
    console.log(`Pool: ${poolInfo.poolName}`);
    console.log(`Created: ${poolInfo.creationTime}`);
    console.log(`Volume: ${poolInfo.totalVolume}`);
}
```

## Deployment

### Testnet Deployment

1. **Create an account on Testnet:**
   ```bash
   aptos init --network testnet
   ```

2. **Fund your account** (use the Aptos testnet faucet)

3. **Deploy your module:**
   ```bash
   aptos move publish --network testnet
   ```

### Mainnet Deployment

```bash
aptos move publish --network mainnet
```

## Architecture

### Resource Accounts
Resource accounts are autonomous accounts used to manage resources without user interaction:

- **SignerCapability**: Allows you to control a resource account from another account
- **Container**: Stores signer capabilities for easy retrieval
- **Use Cases**:
  - Liquidity pool management
  - Contract publishing
  - Multi-signature scenarios

### Trading Pool Module
Built on top of resource accounts:

- **create_trading_pool**: Creates a new pool with metadata
- **get_pool_info**: Retrieves pool statistics
- **update_trading_volume**: Tracks trading volume

## Environment Variables

Create a `.env` file in `aptos/typescript/`:

```bash
APTOS_PRIVATE_KEY=your_private_key_hex
APTOS_NETWORK=testnet  # or mainnet, devnet
```

## Troubleshooting

### Issue: "Module not found"
**Solution:** Ensure dependencies in `Move.toml` are correct and compile first:
```bash
aptos move compile
```

### Issue: "Authorization failed"
**Solution:** Ensure your private key is correct and your account has sufficient balance.

### Issue: "Resource already exists"
**Solution:** The resource account may already have been created. Use a different seed value.

## Common Patterns

### Pattern 1: Create and Fund a Pool
```typescript
const createResponse = await sdk.createTradingPool("seed1", "BTC-USDC");
if (createResponse.success) {
    // Pool created, now register coins, etc.
}
```

### Pattern 2: Retrieve Pool State
```typescript
const poolInfo = await sdk.getPoolInfo(poolAddress);
if (poolInfo) {
    // Use pool data for analytics
}
```

## Best Practices

1. **Always back up private keys** - Store securely in environment variables
2. **Test on testnet first** - Always test thoroughly before mainnet
3. **Use seeds wisely** - Same seed + creator = same resource account
4. **Monitor gas costs** - Complex operations may require more gas
5. **Validate inputs** - Check transaction responses before using results

## Next Steps

1. ✅ Deploy your modules to testnet
2. ✅ Create test trading pools
3. ✅ Integrate with your crypto data pipeline
4. ✅ Build trading strategies on Aptos
5. ✅ Deploy to mainnet when ready

## Resources

- [Aptos Documentation](https://aptos.dev)
- [Move Language Book](https://move-language.github.io/move/)
- [Aptos TypeScript SDK](https://github.com/aptos-labs/aptos-core/tree/main/ecosystem/typescript/sdk)
- [Resource Accounts Guide](https://aptos.dev/build/smart-contracts/resource-accounts)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review examples in `typescript/examples/`
3. Open an issue on the project repository

---

**Happy Trading! 🚀📈**
