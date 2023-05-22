import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { useMUD } from "./MUDContext";
import { HasValue } from "@latticexyz/recs";
import { GameCenter } from "./GameCenter";

export const App = () => {
  const {
    components: { LoadingState, Room },
    network: { playerEntity, singletonEntity },
  } = useMUD();

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  const roomEntity = useComponentValue(Room, playerEntity)?.value;
  const playersInRoom = useEntityQuery([
    HasValue(Room, { value: roomEntity }),
  ]).length;

  const render = () => {
    if (!roomEntity) {
      return <GameCenter />;
    } else if (playersInRoom < 4) {
      return (
        <div>
          Waiting for other players to join ({playersInRoom}/4). Room Id:{" "}
          {roomEntity}
        </div>
      );
    } else {
      return <GameBoard players={playersInRoom} />;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {loadingState.state !== SyncState.LIVE ? (
        <div>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </div>
      ) : (
        render()
      )}
    </div>
  );
};
