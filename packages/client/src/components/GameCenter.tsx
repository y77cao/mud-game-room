import { memo, useState } from "react";
import { useMUD } from "../MUDContext";
import {
  Has,
  HasValue,
  getComponentValueStrict,
  runQuery,
} from "@latticexyz/recs";
import Gixi from "gixi";

import { useEntityQuery } from "@latticexyz/react";
import styled from "styled-components";
import { StyledButton, StyledContainer } from "../globalStyles";
import { WindowHeader } from "./WindowHeader";
import { PendingRoomCell } from "./PendingRoomCell";

export const GameCenter = () => {
  const {
    components: { Room, State, Game, RoomLimit },
    network: { playerEntity, singletonEntity },
    systemCalls: { joinRoom, createRoom },
  } = useMUD();

  const pendingRooms = useEntityQuery([HasValue(State, { value: `0x00` })]).map(
    // 0x00 is RoomState.PENDING how do i do this?
    (entity) => {
      const gameAddress = getComponentValueStrict(Game, entity)?.value;
      const roomLimit = getComponentValueStrict(
        RoomLimit,
        entity
      )?.value?.toString();
      const players = [...runQuery([HasValue(Room, { value: entity })])];
      return { roomId: entity, gameAddress, roomLimit, players };
    }
  );

  const [showJoinRoomPopup, setShowJoinRoomPopup] = useState(false);
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [gameAddress, setGameAddress] = useState("");
  const [roomLimit, setRoomLimit] = useState(0);

  const PendingRooms = memo(
    function PendingRooms({ rooms }: { pendingRooms: unknown[] }) {
      return (
        <PendingRoomsContainer>
          {pendingRooms.map((room, i) => {
            return <PendingRoomCell key={i} {...room} joinRoom={joinRoom} />;
          })}
        </PendingRoomsContainer>
      );
    },
    () => true
  );

  return (
    <GameCenterContainer>
      {showJoinRoomPopup ? (
        <PopupContainer>
          <WindowHeader
            title="Join Room"
            onClose={() => setShowJoinRoomPopup(false)}
          />
          <PopupContent>
            <>Room ID</>
            <input
              style={{ color: "black" }}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <StyledButton onClick={() => joinRoom(roomId)}>Join</StyledButton>
          </PopupContent>
        </PopupContainer>
      ) : null}
      {showCreateRoomPopup ? (
        <PopupContainer>
          <WindowHeader
            title="Create Room"
            onClose={() => setShowCreateRoomPopup(false)}
          />
          <PopupContent>
            <>Game Address</>
            <input
              style={{ color: "black" }}
              onChange={(e) => setGameAddress(e.target.value)}
            />
            <>Room Limit</>
            <input
              style={{ color: "black" }}
              onChange={(e) => setRoomLimit(parseInt(e.target.value))}
            />
            <StyledButton onClick={() => createRoom(gameAddress, roomLimit)}>
              Create
            </StyledButton>
          </PopupContent>
        </PopupContainer>
      ) : null}
      <Title>Game Center</Title>
      <ButtonContainer>
        <StyledButton onClick={() => setShowJoinRoomPopup(true)}>
          Join a Room
        </StyledButton>
        <StyledButton onClick={() => setShowCreateRoomPopup(true)}>
          Create a Room
        </StyledButton>
      </ButtonContainer>
      <PendingRooms rooms={pendingRooms} />
    </GameCenterContainer>
  );
};

const Title = styled.div`
  margin: 20px;
  font-size: 30px;
`;

const GameCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 80%;
  height: 80%;
`;

const ButtonContainer = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
`;

const PendingRoomsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  margin: 20px;
`;

const PopupContainer = styled(StyledContainer)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 400px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: black;
`;

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80%;
`;
