
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {
    expandTo18DecimalsRaw,
} from '../utils/utilities';

const deployPresalePool: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers} = hre;
    const {deploy, execute} = deployments;
    const {deployer, dev} = await getNamedAccounts();

    const { address: poolAddress } = await deploy('PresalePool', {
      from: deployer,
      log: true,
      deterministicDeployment: false,
    });
};

deployPresalePool.tags = ["PRESALEPOOL"]; 

export default deployPresalePool;