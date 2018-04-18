pragma solidity ^0.4.17;

contract MessageBoard {

  /*
      暂时先不添加TOKEN 机制
   */
   /// @dev 留言信息结构体
   struct Message {
       uint dateTime;   // 留言的时间
       string nickName; // 留言的昵称
       string content;  // 留言的内容
   }

   // 通过地址查找留言
   mapping(address => Message) public messages;

    address[] accounts;

   /// @dev 添加留言
   function setMessage (address _account,string _nickName, string _content) public {
      Message message = messages[_account];
      message.dateTime = now;
      message.nickName = _nickName;
      message.content  = _content;

      accounts.push(_account) -1;
   }

   /// @dev 获取留言
   function getMessageContent (address _account) public view returns(string) {
      Message message = messages[_account];

      return message.content;
   }

   /// @dev 获取总的用户数
   function getCounts () public view returns(uint){
       return accounts.length;
   }


}
