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
  },


  handleLeaveMessage: function(event) {
    event.preventDefault();

    var messageBoardInstance;

    var nickName = $('#nickname').val();
    console.log("昵称： "+nickName);
    var content = $('#content').val();
    console.log("内容： "+content);
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.MessageBoard.deployed().then(function(instance) {
        messageBoardInstance = instance;
        // Execute adopt as a transaction by sending account
        return messageBoardInstance.setMessage(account,nickName,content);
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
