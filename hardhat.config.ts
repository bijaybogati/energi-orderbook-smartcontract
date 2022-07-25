require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@typechain/hardhat";

const ENERGI_RPC_URL = process.env.ENERGI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    energi: {
      url: ENERGI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 49797,
    },
  },
  solidity: "0.8.9",
};

export default config;
