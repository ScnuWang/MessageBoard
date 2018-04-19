var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "......"; // 通过注册inrura账户获取
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/<acess token>");// <acess token>通过注册inrura账户获取
      },
      network_id: '3',
      gas: 3141592
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  }
};
