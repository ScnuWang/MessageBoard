pragma solidity ^0.4.17;


contract MessageBoard is StandardToken {

  /*
      Token 基于 ERC20
   */
  /// TOKEN 名称
  string public constant name = "MessageBoardToken";
  /// TOKEN 标识
  string public constant symbol = "MBT";
  /// 最多小数位数
  uint8 public constant decimals = 5;
  /// 账户初始化领取TOKEN
  uint256 public constant ACCOUNT_INITIAL_SUPPLY = 520.1314;
  /// 合约总的TOKEN数
  uint256 public constant INITIAL_SUPPLY = 5201314;
  /// 每次留言所需消耗的TOKEN
  uint256 public constant NEED_TOKEN = 52.01314;


  // 根据地址查询余额
  mapping(address => uint) public accountBalance;
  // 永久保存已经领取过TOKEN的账户
  address[] storage  accounts;

  /// @dev 判断是否已经领取过TOKEN
  function hadGetToken(address _account) public returns(bool) {
    uint length = accounts.length;
    for(uint i = 0; i < length; i++){
        if(_acount == accounts[i]) {
            return true;
        }
    }
    return false;
  }

  /// @dev 领取TOKEN
  function getToken(address _account) public {
    // 判断是否已经领过
    require(!hadGetToken(_acount));
    // 调用StandardToken的transferFrom方法
    transferFrom(msg.sender,_account,ACCOUNT_INITIAL_SUPPLY);
  }

  /// @dev 判断留言者是否有足够的MBT
  function haveEncoughToken(address _account) public returns(bool){
    if(accountBalance[_account] > NEED_TOKEN){
      return true;
    }else{
      return false;
    }
  }

  /// @dev 留言操作，实际上是转账时的备注
  function leavemessage(string content,address _account) public {
      if(haveEncoughToken(_account)){
        transferFrom(_account,msg.sender,NEED_TOKEN);
      }
  }

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function MessageBoard() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
