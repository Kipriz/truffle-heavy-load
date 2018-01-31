pragma solidity ^0.4.4;

/* A very dummy lottery */
contract Lottery {

    uint public price;
    address public house;
    address[] participants;

    uint64 _seed = 0;


    event BuyTicket(address participant);
    event Transfer(address target, uint64 index, uint amount, string msg);

    modifier onlyHouse() {
        require(msg.sender == house);
        _;
    }

    modifier fixedPrice() {
        require(msg.value == price);
        _;
    }

    function Lottery(address _house, uint _price) public {
        house = _house;
        price = _price;
    }

    function takePart() public payable fixedPrice {
        participants.push(msg.sender);
        BuyTicket(msg.sender);
    }

    function makePayouts() public onlyHouse {
        // 80% to main winner
        uint roundFund = this.balance * 80 / 100;

        // 10% to the house, 10% is remainder
        uint houseReward = this.balance * 10 / 100;

        // 10% is remainder
        uint64 winnerIndex = random(uint64(participants.length));
        address winner = participants[winnerIndex];

        winner.transfer(roundFund);
        Transfer(winner, winnerIndex, roundFund, "Main winner");

        house.transfer(houseReward);
        Transfer(house, 0, houseReward, "House reward");

        delete participants;
    }

    function jackpot() public view returns (uint) {
        return this.balance;
    }

    // return a pseudo random number between lower and upper bounds
    // given the number of previous blocks it should hash.
    function random(uint64 upper) public returns (uint64 randomNumber) {
        _seed = uint64(keccak256(keccak256(block.blockhash(block.number), _seed), now));
        return _seed % upper;
    }
}
