const Minter          = artifacts.require("Minter.sol");
const MintTestToken = artifacts.require("MintTestToken.sol");
const TestToken       = artifacts.require("TestToken.sol");
const MintTestTokenMock = artifacts.require("MintTestTokenMock.sol");

contract('Minter', (accounts) => {

  let owner = accounts[0]
  let account = accounts[1]

  it("deployer sender must be a minter", () => 
    Minter.deployed()
    .then(instance => instance.isMinter(owner)
      .then((minter) => assert.isTrue(minter, "deployer sender must be a minter")
    ))
  );

  it("not deployer sender not a minter", () => 
    Minter.deployed()
    .then(instance => instance.isMinter(account)
      .then((minter) => assert.isFalse(minter, "not deployer sender not a minter")
    ))
  );

  it("add minter by owner", () => 
    Minter.deployed()
    .then(instance => instance.addMinterUser(account, {from: owner})
      .then(() => instance.isMinter(account))
      .then((minter) => assert.isTrue(minter, "add minter by owner")
    ))
  );
  it("remove minter by owner", () => 
    Minter.deployed()
    .then(instance => instance.addMinterUser(account, {from: owner})
      .then(() => instance.isMinter(account))
      .then((minter) => assert.isTrue(minter, "add minter by owner"))
      .then(() => instance.removeMinterUser(account))
      .then(() => instance.isMinter(account))
      .then((minter) => assert.isFalse(minter, "remove minter by owner")
    ))
  );
})



contract('Simple mint', async (accounts) => {


  let owner = accounts[0]
  let account = accounts[1]
  let startTime = 100000000
  
  it("mint 100 token to one user", () => 
    MintTestToken.deployed()
    .then(instance => instance.mint(accounts[1], 100, {from: owner})
      .then(() => instance.userFreezeBalance(accounts[1]))
      .then((balance) => assert.equal(balance.valueOf(), 100, "freezeBalance"))
    )
  );

  it("mint 200 token by 2 transaction to one user", () => 
    MintTestToken.deployed()
    .then(instance => instance.mint(accounts[2], 100, {from: owner})
      .then(() => instance.mint(accounts[2], 100, {from: owner}))
      .then(() => instance.userFreezeBalance(accounts[2]))
      .then((balance) => assert.equal(balance.valueOf(), 200, "freezeBalance"))
    )
  );

  it("mint token to different user", () => 
    MintTestToken.deployed()
    .then(instance => instance.mint(accounts[3], 100, {from: owner})
      .then(() => instance.mint(accounts[4], 100, {from: owner}))
      .then(() => instance.userFreezeBalance(accounts[3]))
      .then((balance) => assert.equal(balance.valueOf(), 100, "freezeBalance"))
    )
  );

  it("release token before 6 hours", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[5], 100, {from: owner}))
      .then(() => instance.releaseToken({from: accounts[5]}))
      .then(() => TestToken.deployed())
      .then((testToken) => testToken.balanceOf(accounts[5]))
      .then((balance) => assert.equal(balance.valueOf(), 0))
    )
  );
  
  it("release token between 6 hours and 7", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[6], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 6.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[6]}))
      .then(() => instance.balanceOf(accounts[6]))
      .then((balance) => assert.equal(balance.valueOf(), 10))
    )
  );
  
 it("release token between 8 hours and 9", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[7], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 8.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[7]}))
      .then(() => instance.balanceOf(accounts[7]))
      .then((balance) => assert.equal(balance.valueOf(), 30))
    )
  );

  it("release token between 8 and 9 twice", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[8], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 6.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[8]}))
      .then(() => instance.changeTime(startTime + 8.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[8]}))
      .then(() => instance.balanceOf(accounts[8]))
      .then((balance) => assert.equal(balance.valueOf(), 30))
    )
  );

  it("release token after all", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[9], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 8.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[9]}))
      .then(() => instance.changeTime(startTime + 50 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[9]}))
      .then(() => instance.balanceOf(accounts[9]))
      .then((balance) => assert.equal(balance.valueOf(), 100))
    )
  );


})


contract('Mint several times to one account in different time', async (accounts) => {


  let owner = accounts[0]
  let account = accounts[1]
  let startTime = 100000000
  
  it("release token before 6 hours", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[5], 100, {from: owner}))
      .then(() => instance.mint(accounts[5], 100, {from: owner}))
      .then(() => instance.releaseToken({from: accounts[5]}))
      .then(() => TestToken.deployed())
      .then((testToken) => testToken.balanceOf(accounts[5]))
      .then((balance) => assert.equal(balance.valueOf(), 0))
    )
  );
  
  it("release token after 6 hours before 7", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[6], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 6.5 * 60* 60))
      .then(() => instance.mint(accounts[6], 100, {from: owner}))
      .then(() => instance.releaseToken({from: accounts[6]}))
      .then(() => instance.balanceOf(accounts[6]))
      .then((balance) => assert.equal(balance.valueOf(), 10))
    )
  );
  
 it("release token between 8 hours and 9", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[7], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 6.5 * 60* 60))
      .then(() => instance.mint(accounts[7], 100, {from: owner}))
      .then(() => instance.releaseToken({from: accounts[7]}))
      .then(() => instance.changeTime(startTime + 13.5 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[7]}))
      .then(() => instance.balanceOf(accounts[7]))
      .then((balance) => assert.equal(balance.valueOf(), 100))
    )
  );


  it("release token after all", () => 
    MintTestTokenMock.deployed()
    .then(instance => instance.changeTime(startTime)
      .then(() => instance.mint(accounts[9], 100, {from: owner}))
      .then(() => instance.changeTime(startTime + 8.5 * 60* 60))
      .then(() => instance.mint(accounts[9], 100, {from: owner}))
      .then(() => instance.releaseToken({from: accounts[9]}))
      .then(() => instance.changeTime(startTime + 50 * 60* 60))
      .then(() => instance.releaseToken({from: accounts[9]}))
      .then(() => instance.balanceOf(accounts[9]))
      .then((balance) => assert.equal(balance.valueOf(), 200))
    )
  );


})