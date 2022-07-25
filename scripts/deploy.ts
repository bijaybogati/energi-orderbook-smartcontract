// @ts-ignore
import { ethers, run, network } from "hardhat";
import fs from "fs-extra";
import { OrderBook__factory, Erc20Test__factory } from "../typechain-types";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ENERGI_RPC_URL
  );
  const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);
  const addressPath = `${process.cwd()}/deployed-info/${
    network.config.chainId
  }.json`;

  // @ts-ignore
  const addressBook = JSON.parse(fs.readFileSync(addressPath));

  console.log("Deploying Base Token...");
  const deployBaseTokenTx = await new Erc20Test__factory(wallet).deploy(
    "Base",
    "Base"
  );
  console.log("Deploy TX: ", deployBaseTokenTx.deployTransaction.hash);
  await deployBaseTokenTx.deployed();
  console.log("MakeAsset Token deployed at ", deployBaseTokenTx.address);
  addressBook.baseToken = deployBaseTokenTx.address;

  console.log("Deploying Trade Token...");
  const deployTradeTokenTx = await new Erc20Test__factory(wallet).deploy(
    "Trade",
    "Trade"
  );
  console.log("Deploy TX: ", deployTradeTokenTx.deployTransaction.hash);
  await deployTradeTokenTx.deployed();
  console.log("TakeAsset Token deployed at ", deployTradeTokenTx.address);
  addressBook.tradeToken = deployTradeTokenTx.address;

  console.log("Deploying OrderBook...");
  const deployOrderBookTx = await new OrderBook__factory(wallet).deploy(
    deployTradeTokenTx.address,
    deployBaseTokenTx.address
  );
  console.log("Deploy TX: ", deployOrderBookTx.deployTransaction.hash);
  await deployOrderBookTx.deployed();
  console.log("OrderBook deployed at ", deployOrderBookTx.address);
  addressBook.orderBook = deployOrderBookTx.address;

  await fs.writeFile(addressPath, JSON.stringify(addressBook, null, 2));

  console.log("Order Book contracts deployed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
