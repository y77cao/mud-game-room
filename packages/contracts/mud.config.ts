import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  enums: {
    RoomState: ["PENDING", "ACTIVE", "ENDED"],
  },
  tables: {
    Room: "bytes32",
    State: "bytes1",
    Game: "address",
    RoomLimit: "uint256",
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Room")],
    },
  ],
});
