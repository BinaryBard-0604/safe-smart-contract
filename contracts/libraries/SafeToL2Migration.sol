// SPDX-License-Identifier: LGPL-3.0-only
/* solhint-disable one-contract-per-file */
pragma solidity >=0.7.0 <0.9.0;

import {SafeStorage} from "../libraries/SafeStorage.sol";
import {Enum} from "../common/Enum.sol";

interface ISafe {
    // solhint-disable-next-line
    function VERSION() external view returns (string memory);

    function setFallbackHandler(address handler) external;

    function getOwners() external view returns (address[] memory);

    function getThreshold() external view returns (uint256);
}

/**
 * @title Migration Contract for updating a Safe from 1.3.0/1.4.1 version to a L2 version. Useful when replaying a Safe from a non L2 network in a L2 network.
 * @notice This contract facilitates the migration of a Safe contract from version 1.3.0 to 1.3.0L2 or from 1.4.1 to 1.4.1L2
 *         Older versions are not supported
 * @dev IMPORTANT: The migration will only work with proxies that store the implementation address in the storage slot 0.
 */
contract SafeToL2Migration is SafeStorage {
    // Address of this contract
    address public immutable MIGRATION_SINGLETON;

    /**
     * @notice Constructor
     * @dev Initializes the migrationSingleton with the contract's own address.
     */
    constructor() {
        MIGRATION_SINGLETON = address(this);
    }

    /**
     * @notice Event indicating a change of master copy address.
     * @param singleton New master copy address
     */
    event ChangedMasterCopy(address singleton);

    event SafeSetup(address indexed initiator, address[] owners, uint256 threshold, address initializer, address fallbackHandler);

    event SafeMultiSigTransaction(
        address to,
        uint256 value,
        bytes data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes signatures,
        // We combine nonce, sender and threshold into one to avoid stack too deep
        // Dev note: additionalInfo should not contain `bytes`, as this complicates decoding
        bytes additionalInfo
    );

    function migrate(address l2Singleton, bytes memory functionData) private {
        singleton = l2Singleton;

        // Encode nonce, sender, threshold
        bytes memory additionalInfo = abi.encode(nonce - 1, msg.sender, threshold);

        // Simulate a L2 transaction so indexer picks up the Safe
        emit SafeMultiSigTransaction(
            MIGRATION_SINGLETON,
            0,
            functionData,
            Enum.Operation.DelegateCall,
            0,
            0,
            0,
            address(0),
            address(0),
            "", // We cannot detect signatures
            additionalInfo
        );
        emit ChangedMasterCopy(singleton);
    }

    /**
     * @notice Migrate from Safe 1.3.0/1.4.1 Singleton (L1) to the same version provided L2 singleton
     * Safe is required to have nonce 0 so backend can support it after the migration
     * @dev This function should only be called via a delegatecall to perform the upgrade.
     * Singletons versions will be compared, so it implies that contracts exist
     */
    function migrateToL2(address l2Singleton) public {
        require(address(this) != MIGRATION_SINGLETON, "Migration should only be called via delegatecall");

        require(address(singleton) != l2Singleton, "Safe is already using the singleton");
        // Nonce is increased before executing a tx, so first executed tx will have nonce=1
        require(nonce == 1, "Safe must have not executed any tx");
        bytes32 oldSingletonVersion = keccak256(abi.encodePacked(ISafe(singleton).VERSION()));
        bytes32 newSingletonVersion = keccak256(abi.encodePacked(ISafe(l2Singleton).VERSION()));

        require(oldSingletonVersion == newSingletonVersion, "L2 singleton must match current version singleton");
        // There's no way to make sure if address is a valid singleton, unless we cofigure the contract for every chain
        require(
            newSingletonVersion == keccak256(abi.encodePacked("1.3.0")) || newSingletonVersion == keccak256(abi.encodePacked("1.4.1")),
            "Provided singleton version is not supported"
        );

        // 0xef2624ae - keccak("migrateToL2(address)")
        bytes memory functionData = abi.encodeWithSelector(0xef2624ae, l2Singleton);
        migrate(l2Singleton, functionData);
    }

    function migrateFromV111(address l2Singleton, address fallbackHandler) public {
        require(address(this) != MIGRATION_SINGLETON, "Migration should only be called via delegatecall");

        bytes32 oldSingletonVersion = keccak256(abi.encodePacked(ISafe(singleton).VERSION()));
        require(oldSingletonVersion == keccak256(abi.encodePacked("1.1.1")), "Provided singleton version is not supported");

        bytes32 newSingletonVersion = keccak256(abi.encodePacked(ISafe(l2Singleton).VERSION()));
        require(
            newSingletonVersion == keccak256(abi.encodePacked("1.3.0")) || newSingletonVersion == keccak256(abi.encodePacked("1.4.1")),
            "Provided singleton version is not supported"
        );

        require(isContract(fallbackHandler), "fallbackHandler is not a contract");
        ISafe safe = ISafe(address(this));
        safe.setFallbackHandler(fallbackHandler);
        emit SafeSetup(MIGRATION_SINGLETON, safe.getOwners(), safe.getThreshold(), address(0), fallbackHandler);

        // 0xd9a20812 - keccak("migrateFromV111(address,address)")
        bytes memory functionData = abi.encodeWithSelector(0xd9a20812, l2Singleton, fallbackHandler);
        migrate(l2Singleton, functionData);
    }

    /**
     * @notice Checks whether an Ethereum address corresponds to a contract or an externally owned account (EOA).
     * @param account The Ethereum address to be checked.
     * @return A boolean value indicating whether the address is associated with a contract (true) or an EOA (false).
     * @dev This function relies on the `extcodesize` assembly opcode to determine whether an address is a contract.
     * It may return incorrect results in some edge cases (see documentation for details).
     * Developers should use caution when relying on the results of this function for critical decision-making.
     */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }

        // If the code size is greater than 0, it is a contract; otherwise, it is an EOA.
        return size > 0;
    }
}
