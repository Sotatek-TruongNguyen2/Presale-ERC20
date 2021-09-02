//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";

abstract contract PresaleWhitelist is EIP712Upgradeable {
    bytes32 public root;

    event newRootSettled(bytes32 _oldRoot, bytes32 _newRoot);

    function initialize(bytes32 _root, string memory _name, string memory _version) internal {
        __EIP712_init(_name, _version);
        root = _root;
    }

    function _newRoot(bytes32 _root) internal {
        require(_root != root, "PresaleWhitelist::New Merkle Root is the same!");
        emit newRootSettled(root, _root);
        root = _root;
    }

    function _leaf(address _candidate, uint _maxAmount) internal pure returns(bytes32 hash) {
        hash = keccak256(abi.encodePacked(_candidate, _maxAmount));
    }

    function _verify(bytes32[] memory proof, bytes32 leaf) internal view returns(bool) {
        return MerkleProof.verify(proof, root, leaf);
    }

    function _verifyWhitelist(bytes32[] memory proof, address _candidate, uint _maxAmount) internal view returns(bool) {
        return _verify(proof, _leaf(_candidate, _maxAmount));
    }
}