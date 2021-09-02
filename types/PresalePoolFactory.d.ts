/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface PresalePoolFactoryInterface extends ethers.utils.Interface {
  functions: {
    "changeImpl(address)": FunctionFragment;
    "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)": FunctionFragment;
    "getPoolByIndex(uint256)": FunctionFragment;
    "getPoolsLength()": FunctionFragment;
    "getUserPoolsByToken(address)": FunctionFragment;
    "getUserPoolsLengthByToken(address)": FunctionFragment;
    "impl()": FunctionFragment;
    "initialize(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "paused()": FunctionFragment;
    "pools(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "userCreatedPools(address,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "changeImpl", values: [string]): string;
  encodeFunctionData(
    functionFragment: "createPresalePool",
    values: [
      BytesLike,
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolsLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUserPoolsByToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserPoolsLengthByToken",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "impl", values?: undefined): string;
  encodeFunctionData(functionFragment: "initialize", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(functionFragment: "pools", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "userCreatedPools",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "changeImpl", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createPresalePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserPoolsByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserPoolsLengthByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "impl", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userCreatedPools",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "PresalePoolCreated(address,address,address,address)": EventFragment;
    "PresalePoolImplementationChanged(address,address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PresalePoolCreated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PresalePoolImplementationChanged"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export class PresalePoolFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: PresalePoolFactoryInterface;

  functions: {
    changeImpl(
      _impl: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "changeImpl(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    createPresalePool(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)"(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    getPoolByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "getPoolByIndex(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPoolsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    "getPoolsLength()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    getUserPoolsByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    "getUserPoolsByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    getUserPoolsLengthByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getUserPoolsLengthByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    impl(overrides?: CallOverrides): Promise<[string]>;

    "impl()"(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _impl: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "initialize(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    "owner()"(overrides?: CallOverrides): Promise<[string]>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    "paused()"(overrides?: CallOverrides): Promise<[boolean]>;

    pools(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    "pools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    userCreatedPools(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "userCreatedPools(address,address,uint256)"(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  changeImpl(
    _impl: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "changeImpl(address)"(
    _impl: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  createPresalePool(
    _root: BytesLike,
    _soldToken: string,
    _offerToken: string,
    _fundingWallet: string,
    _duration: BigNumberish,
    _offeredCurrencyRate: BigNumberish,
    _offeredCurrencyDecimal: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)"(
    _root: BytesLike,
    _soldToken: string,
    _offerToken: string,
    _fundingWallet: string,
    _duration: BigNumberish,
    _offeredCurrencyRate: BigNumberish,
    _offeredCurrencyDecimal: BigNumberish,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  getPoolByIndex(
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "getPoolByIndex(uint256)"(
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

  "getPoolsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

  getUserPoolsByToken(
    _soldToken: string,
    overrides?: CallOverrides
  ): Promise<string[]>;

  "getUserPoolsByToken(address)"(
    _soldToken: string,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getUserPoolsLengthByToken(
    _soldToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getUserPoolsLengthByToken(address)"(
    _soldToken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  impl(overrides?: CallOverrides): Promise<string>;

  "impl()"(overrides?: CallOverrides): Promise<string>;

  initialize(
    _impl: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "initialize(address)"(
    _impl: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  "paused()"(overrides?: CallOverrides): Promise<boolean>;

  pools(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "pools(uint256)"(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  renounceOwnership(overrides?: Overrides): Promise<ContractTransaction>;

  "renounceOwnership()"(overrides?: Overrides): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "transferOwnership(address)"(
    newOwner: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  userCreatedPools(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "userCreatedPools(address,address,uint256)"(
    arg0: string,
    arg1: string,
    arg2: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    changeImpl(_impl: string, overrides?: CallOverrides): Promise<void>;

    "changeImpl(address)"(
      _impl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    createPresalePool(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)"(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "getPoolByIndex(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    "getPoolsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    getUserPoolsByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<string[]>;

    "getUserPoolsByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getUserPoolsLengthByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserPoolsLengthByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    impl(overrides?: CallOverrides): Promise<string>;

    "impl()"(overrides?: CallOverrides): Promise<string>;

    initialize(_impl: string, overrides?: CallOverrides): Promise<void>;

    "initialize(address)"(
      _impl: string,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    "paused()"(overrides?: CallOverrides): Promise<boolean>;

    pools(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "pools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "renounceOwnership()"(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    userCreatedPools(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "userCreatedPools(address,address,uint256)"(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    OwnershipTransferred(
      previousOwner: string | null,
      newOwner: string | null
    ): EventFilter;

    Paused(account: null): EventFilter;

    PresalePoolCreated(
      creator: null,
      soldToken: null,
      offerToken: null,
      fundingWallet: null
    ): EventFilter;

    PresalePoolImplementationChanged(oldImpl: null, newImpl: null): EventFilter;

    Unpaused(account: null): EventFilter;
  };

  estimateGas: {
    changeImpl(_impl: string, overrides?: Overrides): Promise<BigNumber>;

    "changeImpl(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    createPresalePool(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)"(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<BigNumber>;

    getPoolByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getPoolByIndex(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPoolsLength(overrides?: CallOverrides): Promise<BigNumber>;

    "getPoolsLength()"(overrides?: CallOverrides): Promise<BigNumber>;

    getUserPoolsByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserPoolsByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserPoolsLengthByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getUserPoolsLengthByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    impl(overrides?: CallOverrides): Promise<BigNumber>;

    "impl()"(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(_impl: string, overrides?: Overrides): Promise<BigNumber>;

    "initialize(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    "paused()"(overrides?: CallOverrides): Promise<BigNumber>;

    pools(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    "pools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(overrides?: Overrides): Promise<BigNumber>;

    "renounceOwnership()"(overrides?: Overrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    userCreatedPools(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "userCreatedPools(address,address,uint256)"(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    changeImpl(
      _impl: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "changeImpl(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    createPresalePool(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "createPresalePool(bytes32,address,address,address,uint256,uint256,uint256)"(
      _root: BytesLike,
      _soldToken: string,
      _offerToken: string,
      _fundingWallet: string,
      _duration: BigNumberish,
      _offeredCurrencyRate: BigNumberish,
      _offeredCurrencyDecimal: BigNumberish,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    getPoolByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getPoolByIndex(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPoolsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getPoolsLength()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserPoolsByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserPoolsByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserPoolsLengthByToken(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getUserPoolsLengthByToken(address)"(
      _soldToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    impl(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "impl()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _impl: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "initialize(address)"(
      _impl: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "paused()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pools(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "pools(uint256)"(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(overrides?: Overrides): Promise<PopulatedTransaction>;

    "renounceOwnership()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "transferOwnership(address)"(
      newOwner: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    userCreatedPools(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "userCreatedPools(address,address,uint256)"(
      arg0: string,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}