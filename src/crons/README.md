# index.ts

The `index.ts` file within the `src/crons` directory of the `ferrumnet/multiswap-validator-node` repository serves as a central point for exporting cron job modules. This file essentially organizes and makes accessible the cron jobs defined in the project for periodic tasks.

transactions.job.ts Documentation
=================================

Overview
--------

The `transactions.job.ts` file is a part of the cron job system within the `multiswap-validator-node` project. It primarily focuses on periodically fetching and processing transaction data. This documentation details the functionality implemented in this file.

Functions
---------

### transactionsJob

-   Purpose: The main exported function that initiates the cron job.
-   Implementation: Invokes the `start` function to begin the transaction monitoring and processing cycle.

### start

-   Purpose: Schedules and starts a cron job to run every 5 seconds, checking and processing new transactions if the system is not already processing a batch.
-   Logic:
    -   A cron job is scheduled using the `node-cron` package to run at a specified interval.
    -   The job checks if `isProccessRunning` is `false` and if there are RPC nodes data available before proceeding.
    -   Triggers `triggerJobs` to process new transactions.

### triggerJobs

-   Purpose: Fetches new transactions and processes each one individually.
-   Logic:
    -   Calls `axiosService.getTransactions()` to retrieve new transactions.
    -   Sets `isProccessRunning` to `true` to indicate that the job is currently processing transactions.
    -   Iterates over each transaction, passing it to `handleJob` for processing.
    -   Resets `isProccessRunning` to `false` after all transactions are processed.

### handleJob

-   Purpose: Processes an individual transaction by checking its uniqueness and fetching relevant chain data.
-   Parameters:
    -   `transaction`: The transaction object to be processed.
-   Logic:
    -   Checks if the transaction's receiveTransactionId is already in the local cache.
    -   If not present, adds it to the local cache and calls `transactionService.fetchChainDataFromNetwork(transaction)` to process the transaction data.

### addTransactionHashInLocalList

-   Purpose: Adds a transaction hash to the local cache to prevent reprocessing.
-   Parameters:
    -   `hash`: The transaction hash to add to the cache.

### removeTransactionHashFromLocalList

-   Purpose: Removes a transaction hash from the local cache.
-   Parameters:
    -   `hash`: The transaction hash to remove from the cache.

### isHashInLocalList

-   Purpose: Checks if a transaction hash is already in the local cache.
-   Parameters:
    -   `hash`: The transaction hash to check.
-   Returns: `boolean`: `true` if the hash is found in the cache, otherwise `false`.

Conclusion
----------

The `transactions.job.ts` file implements a cron job for the `multiswap-validator-node` project, designed to periodically check for and process new transactions. It ensures that transactions are uniquely processed and handles the fetching of chain data for each transaction. This system plays a crucial role in maintaining the application's transaction data up-to-date and reduces redundant processing through local caching mechanisms.