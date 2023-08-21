/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  MultiSendCallOnly,
  MultiSendCallOnlyInterface,
} from "../../../contracts/libraries/MultiSendCallOnly";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "transactions",
        type: "bytes",
      },
    ],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506101a0806100206000396000f3fe60806040526004361061001e5760003560e01c80638d80ff0a14610023575b600080fd5b6100dc6004803603602081101561003957600080fd5b810190808035906020019064010000000081111561005657600080fd5b82018360208201111561006857600080fd5b8035906020019184600183028401116401000000008311171561008a57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506100de565b005b805160205b81811015610165578083015160f81c6001820184015160601c60158301850151603584018601516055850187016000856000811461012857600181146101385761013d565b6000808585888a5af1915061013d565b600080fd5b506000811415610152573d806000803e806000fd5b82605501870196505050505050506100e3565b50505056fea2646970667358221220bcab4618c2a9808426f191e1c010f93c60ce9cf08e723424e924b7c83b868adb64736f6c63430007060033";

type MultiSendCallOnlyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiSendCallOnlyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiSendCallOnly__factory extends ContractFactory {
  constructor(...args: MultiSendCallOnlyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      MultiSendCallOnly & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): MultiSendCallOnly__factory {
    return super.connect(runner) as MultiSendCallOnly__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiSendCallOnlyInterface {
    return new Interface(_abi) as MultiSendCallOnlyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): MultiSendCallOnly {
    return new Contract(address, _abi, runner) as unknown as MultiSendCallOnly;
  }
}
