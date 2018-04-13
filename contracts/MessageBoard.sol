pragma solidity ^0.4.17;


contract MessageBoardToken is StandardToken {

  /*
      Token 基于 ERC20


   */
  string public constant name = "MessageBoardToken"; // solium-disable-line uppercase
  string public constant symbol = "MBT"; // solium-disable-line uppercase
  uint8 public constant decimals = 5; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = 52.01314 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  function MessageBoardToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }



}







contract MessageBoard {

}
