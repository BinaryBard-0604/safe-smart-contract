import { expect } from "chai";
import { deployments, waffle } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { getDefaultCallbackHandler, getSafeWithOwners } from "../../test/utils/setup";
import { logGas, executeTx, SafeTransaction, safeSignTypedData, SafeSignature } from "../../test/utils/execution";
import { Wallet, Contract } from "ethers";

const [user1, user2, user3, user4, user5] = waffle.provider.getWallets();

export interface Contracts {
    targets: Contract[],
    additions: any | undefined
}

const generateTarget = async (owners: Wallet[], threshold: number) => {
    const fallbackHandler = await getDefaultCallbackHandler()
    return await getSafeWithOwners(owners.map((owner) => owner.address), threshold, fallbackHandler.address)
}

export const configs = [
    { name: "single owner", signers: [user1], threshold: 1 },
    { name: "2 out of 2", signers: [user1, user2], threshold: 2 },
    { name: "3 out of 3", signers: [user1, user2, user3], threshold: 3 },
    { name: "3 out of 5", signers: [user1, user2, user3, user4, user5], threshold: 3 },
]

const setupBenchmarkContracts = async (benchmarkFixture?: () => Promise<any>) => {
    return await deployments.createFixture(async ({ deployments }) => {
        await deployments.fixture();
        const targets = []
        for (const config of configs) {
            targets.push(await generateTarget(config.signers, config.threshold))
        }
        return {
            targets,
            additions: (benchmarkFixture ? await benchmarkFixture() : undefined)
        }
    })
}

export interface Benchmark {
    name: string,
    prepare: (contracts: Contracts, target: string) => Promise<SafeTransaction>,
    after?: (contracts: Contracts) => Promise<void>,
    fixture?: () => Promise<any>
}

export const benchmark = async (topic: string, benchmarks: Benchmark[]) => {
    for (const benchmark of benchmarks) {
        const { name, prepare, after, fixture } = benchmark
        const contractSetup = await setupBenchmarkContracts(fixture)
        describe(`${topic} - ${name}`, async () => {
            it("with an EOA", async () => {
                const contracts = await contractSetup()
                const tx = await prepare(contracts, user2.address)
                await logGas(name, user2.sendTransaction({
                    to: tx.to,
                    value: tx.value,
                    data: tx.data
                }))
                if (after) await after(contracts)
            })
            for (const i in configs) {
                const config = configs[i]
                it(`with a ${config.name} Safe`, async () => {
                    const contracts = await contractSetup()
                    const target = contracts.targets[i]
                    const tx = await prepare(contracts, target.address)
                    const threshold = await target.getThreshold()
                    const sigs: SafeSignature[] = await Promise.all(config.signers.slice(0, threshold).map(async (signer) => {
                        return await safeSignTypedData(signer, target, tx)
                    }))
                    await expect(
                        logGas(name, executeTx(target, tx, sigs))
                    ).to.emit(target, "ExecutionSuccess")
                    if (after) await after(contracts)
                })
            }
        })
    }
}