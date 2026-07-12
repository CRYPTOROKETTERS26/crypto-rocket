/// CryptoRocket Trading Pool Module
/// This module demonstrates how to use resource accounts for managing trading pools
module crypto_rocket::trading_pool {
    use std::signer;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use crypto_rocket::resource_account;

    /// Trading Pool information structure
    struct TradingPoolInfo has key {
        signer_cap: SignerCapability,
        pool_name: vector<u8>,
        creation_time: u64,
        total_volume: u64,
    }

    /// Error codes
    const EPOOL_NOT_FOUND: u64 = 1;
    const EUNAUTHORIZED: u64 = 2;

    /// Creates a new trading pool using a resource account
    public entry fun create_trading_pool(
        creator: &signer,
        seed: vector<u8>,
        pool_name: vector<u8>,
    ) {
        let (pool_account, signer_cap) = account::create_resource_account(creator, seed);
        
        let pool_info = TradingPoolInfo {
            signer_cap,
            pool_name,
            creation_time: timestamp::now_seconds(),
            total_volume: 0,
        };
        
        move_to(&pool_account, pool_info);
    }

    /// Get pool information
    public fun get_pool_info(pool_addr: address): (vector<u8>, u64, u64) acquires TradingPoolInfo {
        let pool = borrow_global<TradingPoolInfo>(pool_addr);
        (pool.pool_name, pool.creation_time, pool.total_volume)
    }

    /// Update trading volume
    public entry fun update_trading_volume(
        pool_addr: address,
        volume_increase: u64,
    ) acquires TradingPoolInfo {
        let pool = borrow_global_mut<TradingPoolInfo>(pool_addr);
        pool.total_volume = pool.total_volume + volume_increase;
    }
}
