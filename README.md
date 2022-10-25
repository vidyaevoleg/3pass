3pass
==================
Blockchain-based password manager

Quick start
===========
- Install rust (recommended version 1.60.0)
- Install near-cli (TestNet is recommended for development purpose)
- Install dependencies
```
    npm run deps-install
```
- Build and deploy your contract to TestNet with a temporary dev account:
```
    npm run deploy
```
- After deploy copy & paste the output contract ID (eg. `dev-...`) to the `.env.development` file (check [frontend readme](/frontend/README.md)).
This contract ID will be used by the frontend app
- Start the application by `npm run start`

The Code
==================

1. The smart-contract code lives in the `/contract` folder. See the README there for
   more info
2. The frontend code lives in the `/frontend` folder



Install near-cli (optional)
-------------------------------------

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `npm install`, but for best ergonomics you may want to install it globally:

    npm install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `near-blank-project.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `near-blank-project.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account near-blank-project.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

