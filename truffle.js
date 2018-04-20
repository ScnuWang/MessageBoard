var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "claw neither hedgehog pulse cinnamon become rally rally pistol love since now";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/pK6EEBFCyaazUzbfgzpy");// <acess token>通过注册inrura账户获取
      },
      network_id: 3,
      gas: 3141592
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  }
};
