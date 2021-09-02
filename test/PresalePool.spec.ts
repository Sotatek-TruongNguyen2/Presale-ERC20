import { ethers, network } from "hardhat";
import {
    expandTo18Decimals, expandTo18DecimalsRaw,
  } from '../utils/utilities'
import { expect } from "chai";
import { Signer } from "ethers";
import { MockERC20 } from '../types/MockERC20';
import { MockERC20__factory } from '../types/factories/MockERC20__factory';
import { MockERC20V2 } from '../types/MockERC20V2';
import { MockERC20V2__factory } from '../types/factories/MockERC20V2__factory';
import { TetherToken } from '../types/TetherToken';
import { TetherToken__factory } from '../types/factories/TetherToken__factory';
import { PresalePool } from '../types/PresalePool';
import { PresalePool__factory } from '../types/factories/PresalePool__factory';
import { PresalePoolFactory } from '../types/PresalePoolFactory';
import { PresalePoolFactory__factory } from '../types/factories/PresalePoolFactory__factory';

import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';
import whitelist from "../settings/Whitelist.json";

describe("PresalePool Testing", function () {
    let factory: PresalePoolFactory | undefined;
    let pool: PresalePool | undefined;
    let mockERC20: MockERC20 | undefined;
    let mockERC20V2: MockERC20V2 | undefined;
    let USDT: TetherToken | undefined;
    let alice: Signer | undefined;
    let dave: Signer | undefined;
    let merkleTree: MerkleTree;

    function hashCandidateInfo(account: string, maxAmount: string) {
      return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [account, maxAmount]).slice(2), 'hex');
    }

    beforeEach(async function () {
        try {
            [alice, dave] = await ethers.getSigners();

            merkleTree = new MerkleTree(
              Object.entries(whitelist)
              .map(([address, maxAmount]) => {
                  return hashCandidateInfo(address, maxAmount);
              }),
              keccak256,
              {
                    sortPairs: true
                }
            );

            console.log(merkleTree.getHexRoot());

            pool = await new PresalePool__factory(alice).deploy();
            console.log("POOL IMPLEMENTATION: " + pool.address);

            factory = await new PresalePoolFactory__factory(alice).deploy();
            await factory.initialize(pool.address);
            console.log("POOL FACTORY: " + factory.address);

            mockERC20 = await new MockERC20__factory(alice).deploy("MZXC", "ZXC", expandTo18Decimals(100000));
            console.log("ERC20 ADDRESS: " + mockERC20.address);

            mockERC20V2 = await new MockERC20V2__factory(alice).deploy("MZXC", "ZXC", expandTo18Decimals(100000));
            console.log("ERC20 V2 ADDRESS: " + mockERC20V2.address);

            USDT = await new TetherToken__factory(alice).deploy(expandTo18Decimals(100000, 6), "Tether", "USDT", 6);
            console.log("USDT ADDRESS: " + USDT.address);
        } catch (err: any) {
            console.log(err.message);
        }
    });

    describe("PresalePool", async () => {
      describe("PresalePool Ownable", async () => {
        it("Owner of presale pool is who deploy pool throuh PresaleFactory", async () => {
            if (factory && mockERC20 && USDT && alice) {
              const aliceAddress = await alice.getAddress();
              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20.address,
                USDT.address,
                aliceAddress,
                "3000",
                expandTo18Decimals(2, 12),
                "2"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 

              console.log("POOL ADDRESS: " + poolAddress);

              expect(await createPool.owner()).to.be.equals(aliceAddress);
              expect(await createPool.factory()).to.be.equals(factory.address);
            } 
        });

        it("Only owner will be able to set a new root", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "3000",
              expandTo18Decimals(2, 12),
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 

            console.log("POOL ADDRESS: " + poolAddress);

            await expect(createPool.connect(dave).newRoot("0x0000000000000000000000000000000000000000000000000000000000000000")).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(createPool.connect(alice).newRoot("0x0000000000000000000000000000000000000000000000000000000000000000")).to.be.emit(createPool, "PoolStatsChanged");
          } 
        })  

        it("Only owner will be able to set a new offered Currency", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "3000",
              expandTo18Decimals(2, 12),
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 

            console.log("POOL ADDRESS: " + poolAddress);

            await expect(createPool.connect(dave).newOfferedCurrency(USDT.address, "1000", "10000")).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(createPool.connect(alice).newOfferedCurrency(USDT.address, "1000", "10000")).to.be.emit(createPool, "PoolStatsChanged");
          } 
        })
        
        it("Only owner will be able to set a new open time", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "3000",
              expandTo18Decimals(2, 12),
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 

            console.log("POOL ADDRESS: " + poolAddress);

            const openTime = Math.floor(Date.now() + 1000);

            await expect(createPool.connect(dave).setOpenTime(openTime)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(createPool.connect(alice).setOpenTime(openTime)).to.be.emit(createPool, "PoolStatsChanged");
          } 
        })
        
        it("Only owner will be able to set a new close time", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "3000",
              expandTo18Decimals(2, 12),
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 

            console.log("POOL ADDRESS: " + poolAddress);

            const openTime = Math.floor(Date.now() + 1000);

            await expect(createPool.connect(dave).setCloseTime(openTime)).to.be.revertedWith("Ownable: caller is not the owner");
            await expect(createPool.connect(alice).setCloseTime(openTime)).to.be.emit(createPool, "PoolStatsChanged");
          } 
        })

      })

      describe("PresalePool Whitelist", async () => {
        it("Only candidates in whitelist can purchase ICO token", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "2500000000",
              expandTo18Decimals(2, 12),
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(aliceAddress, expandTo18Decimals(1000)));

            expect(createPool.buyTokenByTokenWithPermission(
              USDT.address,
              aliceAddress,
              expandTo18Decimals(1, 6),
              expandTo18Decimals(1000),
              proof
            )).to.be.revertedWith("PresalePool::Not in whitelist!");
          } 
        });

        it("Only candidates out of the whitelist can't purchase ICO token", async () => {
         if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 5 USDT
            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              USDT.address,
              aliceAddress,
              "2500000000",
              expandTo18Decimals(2, 12),
              "1"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
            await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            await expect(
              createPool.connect(dave).buyTokenByTokenWithPermission(
              USDT.address,
              daveAddress,
              expandTo18Decimals(1, 6),
              expandTo18Decimals(1000),
              proof
            ))
            .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
            .withArgs(
              USDT.address, 
              daveAddress, 
              expandTo18Decimals(1, 6), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(2, 17)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(2, 17));
         
            await expect(
              createPool.connect(dave).buyTokenByTokenWithPermission(
              USDT.address,
              daveAddress,
              expandTo18Decimals(1, 6),
              expandTo18Decimals(1000),
              proof
            ))
            .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
            .withArgs(
              USDT.address, 
              daveAddress, 
              expandTo18Decimals(1, 6), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(2, 17)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(4, 17));
            expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(4, 17));
            expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2, 6));
            expect(await mockERC20.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(4, 17)));
            expect(await mockERC20.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(4, 17));

            console.log("DONE");
          } 
        });
      });

      describe("PresalePool Rate", async () => {
        describe("PresalePool Rate With ICO token decimal >= Offer token decimal", async () => {
          it("PresalePool With Decimal Rate", async () => {
            if (factory && mockERC20 && USDT && alice && dave) {
              const aliceAddress = await alice.getAddress();
              const daveAddress = await dave.getAddress();
              // 1 Token = 0.05 USDT

              const mockERC20Decimal = await mockERC20.decimals();
              const USDTDecimal = 6;
              const rate = 0.05;

              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20.address,
                USDT.address,
                aliceAddress,
                "2500000000",
                expandTo18DecimalsRaw(1, mockERC20Decimal - USDTDecimal).mul(20),
                "0"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
              const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

              await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
              await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
              await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(20)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(20));
          
              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(20)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(40));
              expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(40));
              expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2, 6));
              expect(await mockERC20.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(40)));
              expect(await mockERC20.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(40));
            } 
          });

          it("PresalePool With Normal Rate", async () => {
            if (factory && mockERC20 && USDT && alice && dave) {
              const aliceAddress = await alice.getAddress();
              const daveAddress = await dave.getAddress();
              // 1 Token = 10 USDT

              const mockERC20Decimal = await mockERC20.decimals();
              const USDTDecimal = 6;
              const rate = 10;

              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20.address,
                USDT.address,
                aliceAddress,
                "2500000000",
                expandTo18DecimalsRaw(1, mockERC20Decimal - USDTDecimal).mul(1),
                "1"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
              const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

              await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
              await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
              await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(1, 17)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(1, 17));
          
              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(1, 17)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(2, 17));
              expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(2, 17));
              expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2, 6));
              expect(await mockERC20.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(2, 17)));
              expect(await mockERC20.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(2, 17));
            } 
          });
        });

        describe("PresalePool Rate With ICO token decimal < Offer token decimal", async () => {
          it("PresalePool With Decimal Rate", async () => {
            if (factory && mockERC20V2 && USDT && alice && dave) {
              const aliceAddress = await alice.getAddress();
              const daveAddress = await dave.getAddress();
              // 1 Token = 0.05 USDT
              const mockERC20Decimal = await mockERC20V2.decimals();
              const USDTDecimal = 6;
              const rate = 0.05;

              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20V2.address,
                USDT.address,
                aliceAddress,
                "2500000000",
                20,
                "2"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20V2.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
              const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

              await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
              await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
              await mockERC20V2.transfer(poolAddress, expandTo18Decimals(10000));

              const balanceOfCreator = await USDT.balanceOf(aliceAddress);

              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(20, 4)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(20, 4));
          
              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(20, 4)
              );

              const balanceOfCreatorAfter = await USDT.balanceOf(aliceAddress);

              expect(balanceOfCreator.add(expandTo18Decimals(2,6))).to.be.equals(balanceOfCreatorAfter);
              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(40, 4));
              expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(40, 4));
              expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2, 6));
              expect(await mockERC20V2.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(40, 4)));
              expect(await mockERC20V2.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(40, 4));
            } 
          })

          it("PresalePool With Normal Rate", async () => {
            if (factory && mockERC20V2 && USDT && alice && dave) {
              const aliceAddress = await alice.getAddress();
              const daveAddress = await dave.getAddress();
              // 1 Token = 10 USDT
              const mockERC20Decimal = await mockERC20V2.decimals();
              const USDTDecimal = 6;
              const rate = 10;

              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20V2.address,
                USDT.address,
                aliceAddress,
                "2500000000",
                1,
                "3"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20V2.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
              const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

              await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
              await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
              await mockERC20V2.transfer(poolAddress, expandTo18Decimals(10000));

              const balanceOfCreator = await USDT.balanceOf(aliceAddress);

              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(1, 3)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(1, 3));
          
              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(1, 3)
              );

              const balanceOfCreatorAfter = await USDT.balanceOf(aliceAddress);

              expect(balanceOfCreator.add(expandTo18Decimals(2,6))).to.be.equals(balanceOfCreatorAfter);
              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(2, 3));
              expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(2, 3));
              expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2, 6));
              expect(await mockERC20V2.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(2, 3)));
              expect(await mockERC20V2.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(2, 3));
            } 
          })
        });

        describe("PresalePool can be intialized with many offered tokens", async () => {
          it("Owner able to set new offered token if they want to", async () => {
            if (factory && mockERC20V2 && USDT && alice && dave) {
              const aliceAddress = await alice.getAddress();
              const daveAddress = await dave.getAddress();
              // 1 Token = 10 USDT
              const mockERC20Decimal = await mockERC20V2.decimals();
              const USDTDecimal = 6;
              const rate = 10;

              await factory.createPresalePool(
                merkleTree.getHexRoot(),
                mockERC20V2.address,
                USDT.address,
                aliceAddress,
                "2500000000",
                1,
                "3"
              );

              const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20V2.address, "0");
              const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
              const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

              await USDT.transfer(daveAddress, expandTo18Decimals(1000, 6));
              await USDT.connect(dave).approve(poolAddress, expandTo18Decimals(100000));
              await mockERC20V2.transfer(poolAddress, expandTo18Decimals(10000));

              // 1 Token = 0.2 ETH
              await createPool.newOfferedCurrency(
                "0x0000000000000000000000000000000000000000",
                "5",
                "0"
              );

              const balanceOfCreator = await USDT.balanceOf(aliceAddress);
              const balanceOfCreatorETH = await alice.getBalance();

              await expect(
                createPool.connect(dave).buyTokenByTokenWithPermission(
                USDT.address,
                daveAddress,
                expandTo18Decimals(1, 6),
                expandTo18Decimals(1000),
                proof
              ))
              .to.be.emit(createPool, "BuyTokenByTokenWithPermit")
              .withArgs(
                USDT.address, 
                daveAddress, 
                expandTo18Decimals(1, 6), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(1, 3)
              );

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(1, 3));
          
              await expect(
                createPool.connect(dave).buyTokenByETHWithPermission(
                daveAddress,
                expandTo18Decimals(1000),
                proof,
                {
                  value: expandTo18Decimals(1)
                }
              ))
              .to.be.emit(createPool, "BuyTokenByETHWithPermit")
              .withArgs(
                daveAddress, 
                expandTo18Decimals(1), 
                expandTo18Decimals(1000), 
                expandTo18Decimals(5)
              );

              const balanceOfCreatorAfter = await USDT.balanceOf(aliceAddress);
              const balanceOfCreatorAfterETH = await alice.getBalance();

              expect(balanceOfCreator.add(expandTo18Decimals(1,6))).to.be.equals(balanceOfCreatorAfter);
              expect(balanceOfCreatorETH.add(expandTo18DecimalsRaw(1))).to.be.equals(balanceOfCreatorAfterETH);

              expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18DecimalsRaw(5).add(expandTo18DecimalsRaw(1, 3)));
              expect(await createPool.totalSold()).to.be.equals(expandTo18DecimalsRaw(5).add(expandTo18DecimalsRaw(1, 3)));
              expect(await createPool.totalRaised()).to.be.equals(expandTo18DecimalsRaw(1, 6).add(expandTo18DecimalsRaw(1)));
              expect(await mockERC20V2.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(5).add(expandTo18DecimalsRaw(1, 3))));
              expect(await mockERC20V2.balanceOf(daveAddress)).to.be.equals(expandTo18DecimalsRaw(5).add(expandTo18DecimalsRaw(1, 3)));
            } 
          })
        });
      }); 

      describe("PresalePool Purchasing", async () => {
        it("PresalePool Purchasing With ETH", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 0.003 ETH

            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              "0x0000000000000000000000000000000000000000",
              aliceAddress,
              "2500000000",
              "333",
              "0"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            const balanceOfCreator = await alice.getBalance();

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(1)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(1), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(333)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(333));
        
            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(1)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(1), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(333)
            );

            const balanceOfCreatorAfter = await alice.getBalance();

            expect(balanceOfCreator.add(expandTo18Decimals(2))).to.be.equals(balanceOfCreatorAfter);
            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(666));
            expect(await createPool.totalSold()).to.be.equals(expandTo18Decimals(666));
            expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(2));
            expect(await mockERC20.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(666)));
            expect(await mockERC20.balanceOf(daveAddress)).to.be.equals(expandTo18Decimals(666));
          } 
        })

        it("PresalePool Purchasing by ETH with normal rate", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 4 ETH

            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              "0x0000000000000000000000000000000000000000",
              aliceAddress,
              "2500000000",
              "25",
              "2"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            const balanceOfCreator = await alice.getBalance();

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(1)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(1), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(25, 16)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(25, 16));
        
            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(2)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(2), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(5, 17)
            );

            const balanceOfCreatorAfter = await alice.getBalance();

            expect(balanceOfCreator.add(expandTo18Decimals(3))).to.be.equals(balanceOfCreatorAfter);
            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18DecimalsRaw(5, 17).add(expandTo18DecimalsRaw(25, 16)));
            expect(await createPool.totalSold()).to.be.equals(expandTo18DecimalsRaw(5, 17).add(expandTo18DecimalsRaw(25, 16)));
            expect(await createPool.totalRaised()).to.be.equals(expandTo18Decimals(3));
            expect(await mockERC20.balanceOf(poolAddress)).to.be.equals(expandTo18DecimalsRaw(10000).sub(expandTo18DecimalsRaw(5, 17).add(expandTo18DecimalsRaw(25, 16))));
            expect(await mockERC20.balanceOf(daveAddress)).to.be.equals(expandTo18DecimalsRaw(5, 17).add(expandTo18DecimalsRaw(25, 16)));
          } 
        })

        it("PresalePool Purchasing Amount can't be exceeds max amount", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 0.004 ETH

            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              "0x0000000000000000000000000000000000000000",
              aliceAddress,
              "2500000000",
              "250",
              "0"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(2)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(2), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(500)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(500));
        
            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(3)
              }
            ))
            .to.be.revertedWith("PresalePool::Purchase amount exceeds max amount!");
          } 
        })

        it("Candidate not be able to buy ICO token if time's up", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 0.004 ETH

            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              "0x0000000000000000000000000000000000000000",
              aliceAddress,
              2500000000,
              "250",
              "0"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(2)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(2), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(500)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(500));
        
            await network.provider.send("evm_increaseTime", [2500000001]);

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(3)
              }
            ))
            .to.be.revertedWith("PresalePool::Pool is ended!");
          } 
        })
      });

      describe("PresalePool Refund Remaining ICO Tokens", async () => {
        it("Owner not be able to refund remaining tokens until close time", async () => {
          if (factory && mockERC20 && USDT && alice && dave) {
            const aliceAddress = await alice.getAddress();
            const daveAddress = await dave.getAddress();
            // 1 Token = 0.004 ETH

            await factory.createPresalePool(
              merkleTree.getHexRoot(),
              mockERC20.address,
              "0x0000000000000000000000000000000000000000",
              aliceAddress,
              2500000000 + 2500000000,
              "250",
              "0"
            );

            const poolAddress = await factory.userCreatedPools(aliceAddress, mockERC20.address, "0");
            const createPool = await new PresalePool__factory(alice).attach(poolAddress); 
            const proof = merkleTree.getHexProof(hashCandidateInfo(daveAddress, expandTo18Decimals(1000)));

            await mockERC20.transfer(poolAddress, expandTo18Decimals(10000));

            await expect(
              createPool.connect(dave).buyTokenByETHWithPermission(
              daveAddress,
              expandTo18Decimals(1000),
              proof,
              {
                value: expandTo18Decimals(2)
              }
            ))
            .to.be.emit(createPool, "BuyTokenByETHWithPermit")
            .withArgs(
              daveAddress, 
              expandTo18Decimals(2), 
              expandTo18Decimals(1000), 
              expandTo18Decimals(500)
            );

            expect(await createPool.userPurchased(daveAddress)).to.be.equals(expandTo18Decimals(500));
        
            await expect(
              createPool.connect(dave).refundRemainingTokens(
                daveAddress,
                expandTo18DecimalsRaw(10)
            ))
            .to.be.revertedWith("Ownable: caller is not the owner");

            await expect(
              createPool.refundRemainingTokens(
                daveAddress,
                expandTo18DecimalsRaw(10)
            ))
            .to.be.revertedWith("PresalePool::Pool not ended yet!");
         
            await network.provider.send("evm_increaseTime", [2500000000 + 2500000000 + 1]);
         
            const balanceOf = await mockERC20.balanceOf(daveAddress);

            await expect(
              createPool.refundRemainingTokens(
                daveAddress,
                expandTo18DecimalsRaw(10)
            ))
            .to.be.emit(createPool, "SoldTokenRefunded");

            const balanceOfAfter = await mockERC20.balanceOf(daveAddress);
            expect(balanceOf.add(expandTo18Decimals(10))).to.be.equals(balanceOfAfter);
          } 
        })
      });
    });
});
