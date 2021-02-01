# CryptoStar Dapp
## Udacity Project Submission - Sam Schilling
### Versions

- Truffle CLI v5.1.59
- Truffle HDWallet Provider 1.0.17
- OpenZeppelin 3.3.0

### ERC-721 Token

- Name: `Star Token`
- Symbol: `STK`

### Rinkeby Network

- Contract address: `0x18A82D81fF4e034218256249f861db81950A23cf` ([View on Etherscan](https://rinkeby.etherscan.io/address/0x18a82d81ff4e034218256249f861db81950a23cf))

### Notes

- The function `lookUptokenIdToStarInfo` was renamed to `lookUpTokenIdToStarInfo` to be consistent camel case.
- I refactored the test file to use a method I wrote called `getNewTokenId` to generate a new token ID rather than hard-coding new IDs in each test.