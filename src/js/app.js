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
    //这里的 web3 是否需要调用，在哪里调用的？ 应该暂时还没有调用的
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('MessageBoard.json', function(data) {
      // 获取合约json文件，并通过truffle-contract实例化
      var MessageBoardArtifact = data;

      console.log(MessageBoardArtifact);

      App.contracts.MessageBoard = TruffleContract(MessageBoardArtifact);

      // 为合约提供Provider
      App.contracts.MessageBoard.setProvider(App.web3Provider);

      // 使用我们的合同来检索和标记养宠物
      // return App.markLeaveMessage();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#leavemessage', App.handleLeaveMessage);
    $(document).on('click', '#getToken', App.handleGetToken);
  },
  handleGetToken: function (event) {
      event.preventDefault();
      // 接收TOKEN的地址
      // var address = ‘0x355a6303070bc068219da6128e8dc07506116475’；
      console.log(event);

      var messageboardinstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
        // 默认
        var account = accounts[0];
        var address = accounts[1];

        console.log("当前的账户地址是： "+ account);
        App.contracts.MessageBoard.deployed().then(function(instance) {
          messageboardinstance = instance;
          // 调用合约中的getToken方法给接收地址转账
          console.log("合约实例对象："+messageboardinstance);
          return messageboardinstance.getToken(address);
        }).then(function(result) {
          alert('领取成功!');
          //调用获取余额的方法
          return App.getBalances();
        }).catch(function(err) {
          console.log(err.message);
        });
      });
  },
  getBalances: function() {
    console.log('Getting balances...');

    var messageboardinstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log("当前的账户地址是： "+ account);
      App.contracts.MessageBoard.deployed().then(function(instance) {
        messageboardinstance = instance;

        console.log(account);
        return messageboardinstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        console.log(balance);
        $('#MBTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
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

      App.contracts.MessageBoard.deployed().then(function(instance) {
        adoptionInstance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  markLeaveMessage: function(messagers, account) {
    var leaveMessageInstance;

    App.contracts.MessageBoard.deployed().then(function(instance) {
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

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
