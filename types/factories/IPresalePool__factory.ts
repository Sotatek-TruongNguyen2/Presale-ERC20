/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { IPresalePool } from "../IPresalePool";

export class IPresalePool__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPresalePool {
    return new Contract(address, _abi, signerOrProvider) as IPresalePool;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_root",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_soldToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_offerToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_fundingWallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_openTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_offeredCurrencyRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_offeredCurrencyDecimal",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
