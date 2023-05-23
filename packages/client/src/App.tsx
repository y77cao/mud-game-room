import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { SyncState } from "@latticexyz/network";
import { useMUD } from "./MUDContext";
import { Entity, HasValue, getComponentValue } from "@latticexyz/recs";
import { GameCenter } from "./components/GameCenter";
import styled from "styled-components";
import { WaitingRoom } from "./components/WaitingRoom";
import { RoomState } from "./constants";
import { Game } from "./components/Game";

export const App = () => {
  const {
    components: { LoadingState, Room, State },
    network: { playerEntity, singletonEntity },
  } = useMUD();

  const loadingState = useComponentValue(LoadingState, singletonEntity, {
    state: SyncState.CONNECTING,
    msg: "Connecting",
    percentage: 0,
  });

  const roomEntity = useComponentValue(Room, playerEntity)?.value;
  const roomState = useComponentValue(State, roomEntity as Entity)?.value;

  const render = () => {
    if (!roomEntity || !roomState) {
      return <GameCenter />;
    } else {
      if (roomState === RoomState.PENDING) {
        return <WaitingRoom room={roomEntity} />;
      }

      return <Game room={roomEntity} />;
    }
  };

  return (
    <Container>
      {loadingState.state !== SyncState.LIVE ? (
        <Loading>
          {loadingState.msg} ({Math.floor(loadingState.percentage)}%)
        </Loading>
      ) : (
        render()
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #282c34;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.div``;
