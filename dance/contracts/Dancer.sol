// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract Dancer {
    // State variables
    mapping(address => uint256) public credits;
    mapping(address => uint256) public points;
    address public immutable dancer;
    uint256 public constant CREDIT_PRICE = 0.00001 ether;
    uint256 public constant CLICK_VALUE = 1;
    uint256 public constant POINTS_PER_DANCE = 10;
    
    // New variables for leaderboard
    address[] public users;
    mapping(address => bool) public isRegistered;
    
    // Events
    event CreditsAdded(address user, uint256 amount, uint256 cost);
    event DancePerformed(address creditOwner, uint256 creditsUsed, uint256 pointsEarned);
    
    constructor(address _dancer) {
        dancer = _dancer;
    }
    
    // Modified buyCredits function to track users
    function buyCredits(address _user, uint256 _amount) public payable {
        uint256 cost = _amount * CREDIT_PRICE;
        require(msg.value >= cost, "Insufficient payment");
        
        credits[_user] += _amount;
        
        // Add user to the list if not already registered
        if (!isRegistered[_user]) {
            users.push(_user);
            isRegistered[_user] = true;
        }
        
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
        
        emit CreditsAdded(_user, _amount, cost);
    }
    
    // Existing dance function
    function dance(address _creditOwner) public {
        require(msg.sender == dancer, "Only the dancer can dance");
        require(credits[_creditOwner] >= CLICK_VALUE, "Insufficient credits");
        
        credits[_creditOwner] -= CLICK_VALUE;
        points[_creditOwner] += POINTS_PER_DANCE;
        
        emit DancePerformed(_creditOwner, CLICK_VALUE, POINTS_PER_DANCE);
    }
    
    // New function to get total number of users
    function getUserCount() public view returns (uint256) {
        return users.length;
    }
    
    // New function to get leaderboard
    function getLeaderboard(uint256 _count) public view returns (
        address[] memory topUsers,
        uint256[] memory userPoints
    ) {
        // Limit the count to the total number of users
        uint256 count = _count > users.length ? users.length : _count;
        
        // Initialize return arrays
        topUsers = new address[](count);
        userPoints = new uint256[](count);
        
        // Create temporary arrays for sorting
        address[] memory tempUsers = new address[](users.length);
        uint256[] memory tempPoints = new uint256[](users.length);
        
        // Copy all users and their points
        for (uint256 i = 0; i < users.length; i++) {
            tempUsers[i] = users[i];
            tempPoints[i] = points[users[i]];
        }
        
        // Simple bubble sort (not efficient for large lists but ok for small ones)
        for (uint256 i = 0; i < count; i++) {
            uint256 maxPoints = 0;
            uint256 maxIndex = i;
            
            for (uint256 j = i; j < tempUsers.length; j++) {
                if (tempPoints[j] > maxPoints) {
                    maxPoints = tempPoints[j];
                    maxIndex = j;
                }
            }
            
            // Swap
            if (maxIndex != i) {
                (tempUsers[i], tempUsers[maxIndex]) = (tempUsers[maxIndex], tempUsers[i]);
                (tempPoints[i], tempPoints[maxIndex]) = (tempPoints[maxIndex], tempPoints[i]);
            }
            
            // Add to return arrays
            topUsers[i] = tempUsers[i];
            userPoints[i] = tempPoints[i];
        }
        
        return (topUsers, userPoints);
    }
    
    // Existing view functions
    function checkCredits(address _user) public view returns (uint256) {
        return credits[_user];
    }
    
    function checkPoints(address _user) public view returns (uint256) {
        return points[_user];
    }
}