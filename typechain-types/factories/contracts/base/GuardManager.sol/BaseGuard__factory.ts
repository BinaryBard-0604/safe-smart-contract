/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  BaseGuard,
  BaseGuardInterface,
} from "../../../../contracts/base/GuardManager.sol/BaseGuard";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    name: "checkAfterExecution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "module",
        type: "address",
      },
    ],
    name: "checkModuleTransaction",
    outputs: [
      {
        internalType: "bytes32",
        name: "moduleTxHash",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "enum Enum.Operation",
        name: "operation",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "safeTxGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "baseGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasPrice",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "gasToken",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "refundReceiver",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "signatures",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "msgSender",
        type: "address",
      },
    ],
    name: "checkTransaction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class BaseGuard__factory {
  static readonly abi = _abi;
  static createInterface(): BaseGuardInterface {
    return new Interface(_abi) as BaseGuardInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): BaseGuard {
    return new Contract(address, _abi, runner) as unknown as BaseGuard;
  }
}
