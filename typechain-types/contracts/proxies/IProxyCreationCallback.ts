/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IProxyCreationCallbackInterface extends Interface {
  getFunction(nameOrSignature: "proxyCreated"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "proxyCreated",
    values: [AddressLike, AddressLike, BytesLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "proxyCreated",
    data: BytesLike
  ): Result;
}

export interface IProxyCreationCallback extends BaseContract {
  connect(runner?: ContractRunner | null): IProxyCreationCallback;
  waitForDeployment(): Promise<this>;

  interface: IProxyCreationCallbackInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  proxyCreated: TypedContractMethod<
    [
      proxy: AddressLike,
      _singleton: AddressLike,
      initializer: BytesLike,
      saltNonce: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "proxyCreated"
  ): TypedContractMethod<
    [
      proxy: AddressLike,
      _singleton: AddressLike,
      initializer: BytesLike,
      saltNonce: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  filters: {};
}
