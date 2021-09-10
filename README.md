1. How to deploy Smart contract Presale Pool to mainnet
 + Step 1: In .env file, please change DEPLOYER_PRIVATE_KEY to your private key
 + Step 2: Go into settings folder, you will see Whitelist.json file which is used for whitelisting in presale. It's a JSON file with key is address of whitelisted user and value is maximum ICO tokens that user can buy.
 + Step 3: Go into deploy folder, You don't need to care about PresaleFactory.ts (It only served our testing purpose). Inside PresalePool.ts, you will see "execute" function which will initialize your contract. So all you need to do is replace all the params in "execute" function with your desired params. 
 + Step 4: In package.json file, I already prepared scripts for deploying smart contract to mainnet or testnet.
    - presale:deploy : Use for testing purpose on rinkeby network only.
    - presale:mainnet:deploy : Use for deploying smart contract to mainnet.

2. Calculate rate and decimals field in "execute" function inside deploy/PresalePool.ts file.
 + Formula (I just assume x is rate of Token ~ ETH):
    **  rate = (1 / x) * (10 ** ICO-decimals - 10 ** 18)
    **  decimals = length of decimals part if rate 1 / x is odd    
    
    => If rate is odd, for instance: x = 5 => rate = 0.2 
        => rate field need to input in PresalePool.ts is : 2
        => decimals field need to input in PresalePool.ts is 1
    
    => If rate is not odd, for instance: x = 0.002 => rate = 500
        => rate field need to input in PresalePool.ts is : 500
        => decimals field need to input in PresalePool.ts is 0

 + NOTES: More Examples for calculating rate
    - for example: x = 0.000266 => rate = 3759.398496240601
        => rate field need to input in PresalePool.ts is : 3759398496240601 (because solidity doesn't work with float number, so we need to make sure it's an integer by multiply x by 10 ** LENGTH_OF_DECIMAL_PART)
        => decimals field need to input in PresalePool.ts is 12 (because length of decimals part is 12)

    - for example: x = 0.003 => rate = 333.3333333333333
        => rate field need to input in PresalePool.ts is : 3333333333333333
        => decimals field need to input in PresalePool.ts is 13 (because length of decimals part is 13)

    - for example: x = 1 => rate = 1
        => rate field need to input in PresalePool.ts is : 1
        => decimals field need to input in PresalePool.ts is 0 (because length of decimals part is 0)

    - for example: x = 1.2 => rate = 0.8333333333333334
        => rate field need to input in PresalePool.ts is : 8333333333333334
        => decimals field need to input in PresalePool.ts is 16 (because length of decimals part is 16)

    - Just in case your token decimals is less than 18. For example: 16 => Formula: (1/x) * (10 ** -2)
        => If x = 0.002 => rate = 500 * (10 ** -2)
            => rate field need to input in PresalePool.ts is : 500
            => decimals field need to input in PresalePool.ts is 2 (In normal case, it will be zero)
        
        => If x = 0.000266 => rate = 3759.398496240601 * (10 ** -2)
            => rate field need to input in PresalePool.ts is : 3759398496240601
            => decimals field need to input in PresalePool.ts is 12 + 2 (In normal case, it will be 12)