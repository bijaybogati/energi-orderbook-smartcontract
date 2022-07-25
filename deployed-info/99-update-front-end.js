const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESSES_FILE =
  "../new-interface/energi-assesment-interface/constants/ContractAddresses.json";
const FRONT_END_ABI_FILE =
  "../new-interface/energi-assesment-interface/constants/abi.json";

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end..");
    updateContractAddresses();
    updateAbi();
  }
};

async function updateAbi() {
  const orderBook = await ethers.getContract("OrderBook");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    orderBook.interface.format(ethers.utils.FormatTypes.JSON)
  );
}

async function updateContractAddresses() {
  const orderBook = await ethers.getContract("OrderBook");
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8")
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(orderBook.address)) {
      currentAddresses[chainId].push(orderBook.address);
    }
  }
  {
    currentAddresses[chainId] = [orderBook.address];
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ["all", "frontend"];
