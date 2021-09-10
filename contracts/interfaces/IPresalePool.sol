//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPresalePool {
    function initialize(
        bytes32 _root,
        address _soldToken,
        address _offerToken,
        address _fundingWallet,
        uint _openTime,
        uint _duration,
        uint _offeredCurrencyRate,
        uint _offeredCurrencyDecimal
    ) external;
}
