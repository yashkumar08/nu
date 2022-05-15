// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
contract College{
    uint public totalUsers=0;
    address public admin;
    mapping(address=>string) public roles;
    struct UserInfo{
        string name;
        string email;
        string phno;
        string role;
    }
    mapping(uint=>UserInfo) public users;
    mapping(address=>UserInfo) public getUserInfo;
    constructor() public {
        admin=msg.sender;
    }
    function addUser(string memory _n,string memory _e,string memory _p,string memory _r) public {
        totalUsers++;
        roles[msg.sender]=_r;
        users[totalUsers]=UserInfo(_n,_e,_p,_r);
        getUserInfo[msg.sender]=UserInfo(_n,_e,_p,_r);

    }
}