// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DANCER = "0x5c770AB50F2A83a5703e574Ef3a5437542092986";


const DancerModule = buildModule("DancerModule", (m) => {
  const dancer = m.getParameter("_dancer", DANCER);


  const dancer_contract = m.contract("Dancer", [dancer]);

  return { dancer_contract };
});

export default DancerModule;
