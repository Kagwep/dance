// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract Dancer {
    // State variables
    mapping(address => uint256) public credits;
    mapping(address => uint256) public points;
    address public immutable dancer;
    uint256 public constant CREDIT_PRICE = 0.0001 ether; // Very cheap credits
    uint256 public constant CLICK_VALUE = 1; // Fixed credit consumption per dance
    uint256 public constant POINTS_PER_DANCE = 10; // Points earned per dance

    // Events
    event CreditsAdded(address user, uint256 amount, uint256 cost);
    event DancePerformed(address creditOwner, uint256 creditsUsed, uint256 pointsEarned);

    constructor(address _dancer) {
        dancer = _dancer;
    }

    // Function to purchase dance credits
    function buyCredits(address _user, uint256 _amount) public payable {
        uint256 cost = _amount * CREDIT_PRICE;
        require(msg.value >= cost, "Insufficient payment");
        
        credits[_user] += _amount;
        
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit CreditsAdded(_user, _amount, cost);
    }

    // Function to dance and consume credits
    function dance(address _creditOwner) public {
        require(msg.sender == dancer, "Only the dancer can dance");
        require(credits[_creditOwner] >= CLICK_VALUE, "Insufficient credits");
        
        credits[_creditOwner] -= CLICK_VALUE;
        points[_creditOwner] += POINTS_PER_DANCE;
        
        emit DancePerformed(_creditOwner, CLICK_VALUE, POINTS_PER_DANCE);
    }

    // View functions
    function checkCredits(address _user) public view returns (uint256) {
        return credits[_user];
    }

    function checkPoints(address _user) public view returns (uint256) {
        return points[_user];
    }
}