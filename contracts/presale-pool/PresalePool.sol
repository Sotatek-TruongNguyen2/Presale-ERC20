//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../extensions/PresaleWhitelist.sol";
import "../tokens/ERC20/IERC20.sol";
import "../libraries/TransferHelper.sol";
import "hardhat/console.sol";

contract PresalePool is PresaleWhitelist, ReentrancyGuardUpgradeable, PausableUpgradeable, OwnableUpgradeable {
    struct OfferedCurrency {
        uint rate;
        uint decimals;
    }
    
    IERC20 public soldToken;
    address public fundingWallet;
    address public factory;

    uint public openTime = block.timestamp;
    uint public closeTime;
    uint public totalSold;
    uint public totalRaised;

    mapping(address => OfferedCurrency) public offeredCurrencies;
    mapping(address => uint) public userPurchased;

    event PoolCreated(
        bytes32 root,
        address factory,
        address soldToken,
        address indexed fundingWallet,
        address indexed owner,
        address indexed offeredCurrency,
        uint offeredCurrencyDecimal,
        uint offeredCurrencyRate,
        uint openTime,
        uint closeTime
    );

    event BuyTokenByTokenWithPermit(
        address indexed offerToken,
        address indexed beneficiary,
        uint amount,
        uint maxAmount,
        uint soldTokens
    );

    event BuyTokenByETHWithPermit(
        address indexed beneficiary,
        uint amount,
        uint maxAmount,
        uint soldTokens
    );

    event SoldTokenRefunded(
        address indexed wallet,
        uint amount
    );

    event PoolStatsChanged();

    fallback() external {
        revert();
    }

    /**
     * @dev fallback function
     */
    receive() external payable {
        revert();
    }

    function initialize(
        bytes32 _root,
        address _soldToken,
        address _offerToken,
        address _fundingWallet,
        uint _duration,
        uint _offeredCurrencyRate,
        uint _offeredCurrencyDecimal
    ) external initializer {
        super.initialize(_root, "Presale Pool", "1.0.0");

        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        factory = msg.sender;        
        soldToken = IERC20(_soldToken);
        fundingWallet = _fundingWallet;
        closeTime = openTime + _duration;
        offeredCurrencies[_offerToken] = OfferedCurrency(_offeredCurrencyRate, _offeredCurrencyDecimal);

        transferOwnership(tx.origin);

        emit PoolCreated(
            _root,
            factory, address(_soldToken), 
            fundingWallet, owner(), 
            _offerToken, 
            _offeredCurrencyDecimal, 
            _offeredCurrencyRate,
            openTime,
            closeTime
        );
    }

    function newRoot(bytes32 _root) external onlyOwner {
        _newRoot(_root);
        emit PoolStatsChanged();
    }

    function newOfferedCurrency(address _offerToken, uint _rate, uint _decimals) external onlyOwner {
        offeredCurrencies[_offerToken].rate = _rate;
        offeredCurrencies[_offerToken].decimals = _decimals;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the close time (time in seconds). User can buy before close time.
     * @param _closeTime Value in uint256 determine when we stop user to by tokens
     */
    function setCloseTime(uint256 _closeTime) external onlyOwner {
        require(_closeTime >= block.timestamp, "PresalePool::INVALID_TIME");
        closeTime = _closeTime;
        emit PoolStatsChanged();
    }

    /**
     * @notice Owner can set the open time (time in seconds). User can buy after open time.
     * @param _openTime Value in uint256 determine when we allow user to by tokens
     */
    function setOpenTime(uint256 _openTime) external onlyOwner {
        openTime = _openTime;
        emit PoolStatsChanged();
    }

    function buyTokenByTokenWithPermission(
        address _offerToken,
        address _beneficiary,
        uint _amount,
        uint _maxAmount,
        bytes32[] memory proof
    ) external whenNotPaused nonReentrant {
        OfferedCurrency memory offeredCurrency = offeredCurrencies[_offerToken];
        require(offeredCurrency.rate != 0, "PresalePool::Offer currency rate is invalid!");
        require(_validPurchase(), "PresalePool::Pool is ended!");
        require(_verifyWhitelist(proof, msg.sender, _maxAmount), "PresalePool::Not in whitelist!");
        require(_verifyAllowance(msg.sender, _offerToken, _amount), "PresalePool::Allowance for offered token unreached!");

        _preValidatePurchase(_beneficiary, _amount);

        uint soldTokenAmount = _getSoldTokensByOfferedCurrency(_offerToken, _amount);
        require(soldTokenAmount + userPurchased[msg.sender] <= _maxAmount, "PresalePool::Purchase amount exceeds max amount!");

        _forwardFundTransfer(_offerToken, _amount);
        _deliverTokens(_beneficiary, soldTokenAmount);
        _updatePurchasingState(_amount, soldTokenAmount);

        emit BuyTokenByTokenWithPermit(_offerToken, _beneficiary, _amount, _maxAmount, soldTokenAmount);
    }

    function buyTokenByETHWithPermission(
        address _beneficiary,
        uint _maxAmount,
        bytes32[] memory proof
    ) external payable whenNotPaused nonReentrant {
        uint _amount = msg.value;
        
        OfferedCurrency memory offeredCurrency = offeredCurrencies[address(0)];
        require(offeredCurrency.rate != 0, "PresalePool::Offer currency rate is invalid!");
        require(_validPurchase(), "PresalePool::Pool is ended!");
        require(_verifyWhitelist(proof, msg.sender, _maxAmount), "PresalePool::Not in whitelist!");

        _preValidatePurchase(_beneficiary, _amount);

        uint soldTokenAmount = _getSoldTokensByOfferedCurrency(address(0), _amount);
        require(soldTokenAmount + userPurchased[msg.sender] <= _maxAmount, "PresalePool::Purchase amount exceeds max amount!");

        _forwardFunds(_amount);
        _deliverTokens(_beneficiary, soldTokenAmount);
        _updatePurchasingState(_amount, soldTokenAmount);

        emit BuyTokenByETHWithPermit(_beneficiary, _amount, _maxAmount, soldTokenAmount);
    }

    function isFinalized() public view returns(bool) {
        return block.timestamp > closeTime;
    }

    function refundRemainingTokens(address _wallet, uint _amount) external onlyOwner {
        require(isFinalized(), "PresalePool::Pool not ended yet!");
        require(IERC20(soldToken).balanceOf(address(this)) >= _amount, "PresalePool::Refund amount exceeds pool balance!");
        _deliverTokens(_wallet, _amount);
        emit SoldTokenRefunded(_wallet, _amount);
    }

    function _updatePurchasingState(uint256 _raiseAmount, uint256 _soldAmount)
    internal
    {
        totalRaised = totalRaised + _raiseAmount;
        totalSold = totalSold + _soldAmount;
    }

    function _deliverTokens(address _beneficiary, uint _amount) internal {
        TransferHelper.safeTransfer(address(soldToken), _beneficiary, _amount);
        userPurchased[msg.sender] += _amount;
    }

    function _forwardFundTransfer(address _token, uint _value) internal {
        TransferHelper.safeTransferFrom(_token, msg.sender, fundingWallet, _value);
    }

    function _forwardFunds(uint256 _value) internal {
        (bool success, ) = payable(fundingWallet).call{value: _value}("");
        require(success, "POOL::WALLET_TRANSFER_FAILED");
    }


    function _preValidatePurchase(address _beneficiary, uint _amount) internal pure {
        require(_beneficiary != address(0), "PresalePool::Beneficiary is not valid!");
        require(_amount != 0, "PresalePool::Invalid Token amount");
    }

    function _verifyAllowance(address _user, address _token, uint _amount) internal view returns(bool) {
        uint allowance = IERC20(_token).allowance(_user, address(this));
        return allowance >= _amount;
    }

    function _validPurchase() internal view returns(bool) {
        bool withinPerioid = block.timestamp >= openTime && block.timestamp <= closeTime;
        return withinPerioid;
    }
    
    function _getSoldTokensByOfferedCurrency(address _token, uint _amount) internal view returns(uint) {
        OfferedCurrency memory offeredCurrency = offeredCurrencies[_token];
        return _amount * offeredCurrency.rate / (10 ** offeredCurrency.decimals);      
    }
}