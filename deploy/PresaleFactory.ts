
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {
    expandTo18DecimalsRaw,
} from '../utils/utilities';

const deployPresaleFactory: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const {deployments, getNamedAccounts, ethers} = hre;
    const {deploy, execute} = deployments;
    const {deployer, dev} = await getNamedAccounts();

    const presaleAddress = (await deployments.get("PresalePool")).address;

    const { address: factoryAddress } = await deploy('PresalePoolFactory', {
      from: deployer,
      args: [],
      log: true,
      deterministicDeployment: false,
    });

    await execute(
        "PresalePoolFactory", 
        { 
          from: deployer, 
          gasLimit: "300000", 
          log: true 
        }, 
        "initialize",
        presaleAddress
    )
};

deployPresaleFactory.dependencies = ["PRESALEPOOL"];
deployPresaleFactory.tags = ["FACTORY"];

export default deployPresaleFactory;