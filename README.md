# Project Information

<h4>This is a dEX (Decentralized Exchange) Platform for trading in a custom ERC-20 complient token</h4>
<h4>This token is named BRF which can be traded with 2 mock tokens when are also created using the ERC-20 complient token which is created using Token contract. These mock tokens are: mETH & mDAI</h4>
<h4>This Project is created using:</h4>
<p>
    <span>-<em><a href="https://react.dev/" target="_blank" >React JS</a> (for Frontend)</em></span><br/>
    <span>-<em><a href="https://soliditylang.org/" target="_blank" >Solidity</a> (for Smart Contracts)</em></span><br/>
    <span>-<em><a href="https://docs.ethers.org/v5/" target="_blank" >Etherjs</a> (for Blockchain Interaction)</em></span><br/>
    <span>-<em><a href="https://hardhat.org/" target="_blank" >Hardhat</a> (Ethereum Development Environment)</em></span><br/>
</p>

---

# To start the project follow these commands:
Note: Following above steps will start the project
- Add Hardhat account 0 and Hardhat account 1 to your Metamask using the private key generated on execution of  ```npx hardhat node```
- In case of any unexpected behaviour occurance, check the address of tokens and exchange from 2nd commands output match the ones in utils/addressConfig.json.
They should be same for the deploy to work correctly when using hardhat as network

First Command: (To execute hardhat node)

```
npx hardhat node
```

Second Command: (To run Deploy script)

```
npx hardhat run --network localhost scripts/1_deploy.js
```

Third Command: (To run seeding script so that we have filled Order Book at start)

```
npx hardhat run --network localhost scripts/2_seed-exchange.js
```

Fourth Command: (To run local server to view the dEX platform)

```
npm run dev
```

# Follow above commands to see project in action

---

# Below if how the app looks in several states:

---

<h2>Home Page (When account not connected)</h2>

# <img src="./public/platformSS/LandingPage.png" alt="Image" />

<h2>Home Page (When account is connected)</h2>

# <img src="./public/platformSS/ConnectedAccount.png" alt="Image" />

<h2>Home Page (When Transaction is Successful)</h2>

# <img src="./public/platformSS/TXSuccessfull.png" alt="Image" />

# To run scripts only of deployment follow these steps:

First Command:

```
npx hardhat node
```

Second Command:

```
npx hardhat run --network localhost scripts/1_deploy.js
```

Third Command:

```
npx hardhat run --network localhost scripts/2_seed-exchange.js
```

# To run tests only follow these steps:

To run all tests together:

```
npx hardhat test
```

To run Test for Token only:

```
npx hardhat test test/Token.js
```

To run Test for Exchange:

```
npx hardhat test test/Exchange.js
```
