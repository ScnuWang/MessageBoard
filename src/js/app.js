App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // 初始化Web3
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    //这里的 web3 是否需要调用，在哪里调用的？ 应该暂时还没有调用的


    return App.initContract();
  },

  initContract: function() {

    $.getJSON('MessageBoard.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var MessageBoardArtifact = data;

      App.contracts.MessageBoard = TruffleContract(MessageBoardArtifact);

      // Set the provider for our contract
      App.contracts.MessageBoard.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markLeaveMessage();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#leavemessage', App.handleLeaveMessage);
  },

  markLeaveMessage: function(messagers, account) {
    var leaveMessageInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      leaveMessageInstance = instance;

      return leaveMessageInstance.getMessagers.call();
    }).then(function(messagers) {
      for (i = 0; i < messagers.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {// 判断是否是僵尸地址，这被称作 “烧币”, 就是把代币转移到一个谁也没有私钥的地址，让这个代币永远也无法恢复
          $('#leavemessage').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleLeaveMessage: function(event) {
    event.preventDefault();

    var text = parseString($(event.target).text);

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
