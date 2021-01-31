const StarNotary = artifacts.require("StarNotary");

let accounts;
let owner;
let newStarId = 1;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = getNewTokenId();
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = getNewTokenId();
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = getNewTokenId();
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = getNewTokenId();
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = getNewTokenId();
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests
it('can add the star name and star symbol properly', async() => {
    let instance = await StarNotary.deployed();

    let actualName = await instance.name.call();
    let actualSymbol = await instance.symbol.call();

    assert.equal("Star Token", actualName);
    assert.equal("STK", actualSymbol);
});

it('lets 2 users exchange stars', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[1];
    let user2 = accounts[2];

    let star1Id = getNewTokenId();
    let star2Id = getNewTokenId();
    let star1Name = "star1";
    let star2Name = "star2";

    await instance.createStar(star1Name, star1Id, {from: user1});
    await instance.createStar(star2Name, star2Id, {from: user2});

    await instance.exchangeStars(star1Id, star2Id, {from: user1});

    let ownerOfStar1 = await instance.ownerOf.call(star1Id);
    let ownerOfStar2 = await instance.ownerOf.call(star2Id);

    assert.equal(ownerOfStar2, user1);
    assert.equal(ownerOfStar1, user2);
});

it('lets a user transfer a star', async() => {
    let instance = await StarNotary.deployed();

    let user1 = accounts[0];
    let user2 = accounts[1];

    let starId = getNewTokenId();

    await instance.createStar("test star", starId, {from: user1});
    await instance.transferStar(user2, starId, {from: user1});

    let starOwner = await instance.ownerOf.call(starId);
    assert.equal(user2, starOwner);
});

it('lookUpTokenIdToStarInfo test', async() => {
    let instance = await StarNotary.deployed();

    let starName = "Battlestar Galactica";
    let starId = getNewTokenId();

    await instance.createStar(starName, starId, {from: owner});

    let actualName = await instance.lookUpTokenIdToStarInfo.call(starId);

    assert.equal(starName, actualName);
});

function getNewTokenId() {
    let id = newStarId;
    newStarId += 1;
    return id;
}