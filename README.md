# Project Information

<h3>This is a dEX (Decentralized Exchange) Platform for trading in a custom ERC-20 complient token</h3>
<h3>This token is named BRF which can be traded with 2 mock tokens when are also created using the ERC-20 complient token which is created using Token contract. These mock tokens are: mETH & mDAI</h3>
<h3>This Project is created using:</h3>
<p>
    <em>Frontend: React JS (Built using VITE)</em> <br/>
    <em>Blockchain: Solidity (for smart contracts), Hardhat, Ethersjs</em> <br/>
</p>

---

# To start the project follow these commands:

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

Note: Following above steps will start the project

In case of any unexpected behaviour occurance, check the address of tokens and exchange from 2nd commands output match the ones in utils/addressConfig.json.
They should be same for the deploy to work correctly when using hardhat as network

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
