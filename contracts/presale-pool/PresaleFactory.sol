//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "../libraries/Clones.sol";
import "../interfaces/IPresalePool.sol";


contract PresalePoolFactory is PausableUpgradeable, OwnableUpgradeable {
    address public impl;
    address[] public pools;
    mapping(address => mapping(address => address[])) public userCreatedPools;

    event PresalePoolCreated(address creator, address soldToken, address offerToken, address fundingWallet);
    event PresalePoolImplementationChanged(address oldImpl, address newImpl);

    function initialize(address _impl) external initializer {
        __Ownable_init();
        __Pausable_init();
        impl = _impl;
    }

    function changeImpl(address _impl) external onlyOwner {
        require(_impl != impl, "PresalePoolFactory::Not able to set same implementation!");
        emit PresalePoolImplementationChanged(impl, _impl);
        impl = _impl;
    }

    function getUserPoolsByToken(address _soldToken) public view returns(address[] memory) {
        return userCreatedPools[msg.sender][_soldToken];
    }

    function getUserPoolsLengthByToken(address _soldToken) public view returns(uint) {
        return userCreatedPools[msg.sender][_soldToken].length;
    }

    function getPoolsLength() public view returns(uint) {
        return pools.length;
    }

    function getPoolByIndex(uint _index) public view returns(address) {
        return pools[_index];
    }

    function createPresalePool(
        bytes32 _root,
        address _soldToken,
        address _offerToken,
        address _fundingWallet,
        uint _duration,
        uint _offeredCurrencyRate,
        uint _offeredCurrencyDecimal
    ) external whenNotPaused returns(address) {
        require(_soldToken != address(0), "PresalePoolFactory::Invalid sold token address!");
        require(_fundingWallet != address(0), "PresalePoolFactory::Invalid funding wallet address!");
        require(_offeredCurrencyRate != 0, "PresalePoolFactory::Invalid offer currency rate!");
        require(_duration != 0, "PresalePoolFactory::Invalid pool duration");
   
        address newPool = Clones.clone(impl);
        IPresalePool(newPool).initialize(
            _root, 
            _soldToken, 
            _offerToken, 
            _fundingWallet, 
            _duration, 
            _offeredCurrencyRate, 
            _offeredCurrencyDecimal
        );

        _updatePoolStats(newPool, _soldToken);

        emit PresalePoolCreated(
            msg.sender,
            _soldToken,
            _offerToken,
            _fundingWallet
        );

        return newPool;
    }

    function _updatePoolStats(address _poolAddress, address _soldToken) internal {
        userCreatedPools[msg.sender][_soldToken].push(_poolAddress);
        pools.push(_poolAddress);
    }
}