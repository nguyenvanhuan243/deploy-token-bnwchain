import { ethers, run } from "hardhat";

async function main() {
  console.log("Starting BNW Token deployment...");

  // Get the deployer signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BNW");

  // Get the contract factory with the deployer signer
  const BNWToken = await ethers.getContractFactory("SwapToken");

  // Deploy the contract
  console.log("Deploying BNW Token...");
  const token = await BNWToken.deploy();

  // Wait for deployment to finish
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("BNW Token deployed to:", address);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  const deployTx = token.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5);
    console.log("Transaction confirmed!");
  }

  // Verify the contract on the network's block explorer (if supported)
  if (process.env.VERIFY_CONTRACT === "true") {
    console.log("Verifying contract...");
    try {
      await run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Contract verification failed:", error);
    }
  }

  console.log("Deployment completed!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 