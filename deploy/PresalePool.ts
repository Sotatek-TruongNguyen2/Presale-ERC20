
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {
    expandTo18DecimalsRaw,
} from '../utils/utilities';

import MerkleTree from 'merkletreejs';
import keccak256 from 'keccak256';
import whitelist from "../settings/Whitelist.json";


const deployPresalePool: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers} = hre;
    const {deploy, execute} = deployments;
    const {deployer, dev} = await getNamedAccounts();

    function hashCandidateInfo(account: string, maxAmount: string) {
      return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [account, maxAmount]).slice(2), 'hex');
    }

    const { address: poolAddress } = await deploy('PresalePool', {
      from: deployer,
      log: true,
      deterministicDeployment: false,
      gasPrice: "0xEE6B2800"
    });

    let merkleTree = new MerkleTree(
      Object.entries(whitelist)
      .map(([address, maxAmount]) => {
          return hashCandidateInfo(address, maxAmount);
      }),
      keccak256,
      {
            sortPairs: true
        }
    );

    await execute(
      "PresalePool", 
      { 
        from: deployer, 
        gasLimit: "1000000", 
        log: true 
      }, 
      "initialize",
      merkleTree.getHexRoot(),
      "0x0fdf4b623594fdc2786c72c7577adf468b15e57a", // sold token
      "0x0000000000000000000000000000000000000000", // address(0) if offer token is
      "0xf9fB171C086bbaa5Eac2A0c8816ACA5421E97A74", // funding wallet
      "1631271600",  // open time in seconds
      "21600", // durations in seconds,
      "1000000", // Rate Field for Token ~ ETH
      "0" // Decimals Field if the above rate is odd
)   
};

deployPresalePool.tags = ["PRESALEPOOL"]; 

export default deployPresalePool;