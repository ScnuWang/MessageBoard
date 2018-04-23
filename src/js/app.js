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
      // 这里的地址不需要修改成Ropsten测试网地址，因为Truffle.js里面已经配置了，这里根本不会执行下面这代码
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
    }
    //这里的 web3 是否需要调用，在哪里调用的？这里是为了另外一个新用户访问应用的时候，重新注入一个新的web3的实例
    web3 = new Web3(App.web3Provider);
    console.log(web3);

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

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#leavemessage', App.handleLeaveMessage);
    $(document).on('click', '#querymessage', App.handleQueryMessage);
  },


  handleLeaveMessage: function(event) {
    event.preventDefault();

    var messageBoardInstance;

    MessageFrom = $('#leavemessageaccount').val();
    console.log("账户： "+MessageFrom);
    var content = $('#content').val();
    console.log("内容： "+content);
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log("所有的账户： "+accounts);
      // 如果指定了账户就使用指定账户留言，否则使用默认第一个账户
      var account;
      if(!MessageFrom){
        account = accounts[0];
      }else {
        account = MessageFrom;
      }
      console.log("=====>"+account);
      App.contracts.MessageBoard.deployed().then(function(instance) {
        messageBoardInstance = instance;
        return messageBoardInstance.setMessage(account,content);
      }).then(function(instance){
        alert("留言成功！！！");
      }).catch(function(err) {
        alert("出现异常，请联系管理员：scnu_wang@163.com")
        console.log(err.message);
      });
    });
  },

  handleQueryMessage: function(event) {
    event.preventDefault();

    var messageBoardInstance;

    MessageFrom = $('#querymessageaccount').val();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account;
      if(!MessageFrom){
        account = accounts[0];
      }else {
        account = MessageFrom;
      }

      App.contracts.MessageBoard.deployed().then(function(instance) {
        messageBoardInstance = instance;
        console.log(instance);
        return messageBoardInstance.getMessageContent(account);
      }).then(function(result) {
        console.log(result);
        $('#MessageBoard').text("查询结果： "+result);
    }).catch(function(err) {
        alert("出现异常！！！")
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
