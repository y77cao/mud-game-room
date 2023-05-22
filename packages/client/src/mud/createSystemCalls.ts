import { getComponentValue } from "@latticexyz/recs";
import { awaitStreamValue } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { Room, State, Game }: ClientComponents
) {
  const joinRoom = async (room: string) => {
    try {
      const tx = await worldSend("joinRoom", [room]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } catch (e) {
      console.error(e);
    }
  };

  const createRoom = async (gameAddress: string, roomLimit: number) => {
    try {
      const tx = await worldSend("createRoom", [gameAddress, roomLimit]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } catch (e) {
      console.error(e);
    }
  };

  const startGame = async () => {
    try {
      const tx = await worldSend("startGame", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } catch (e) {
      console.error(e);
    }
  };

  const leaveRoom = async () => {
    try {
      const tx = await worldSend("leaveRoom", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    joinRoom,
    createRoom,
    startGame,
    leaveRoom,
  };
}
