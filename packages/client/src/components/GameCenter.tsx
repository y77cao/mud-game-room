import { useState } from "react";
import { useMUD } from "../MUDContext";
import {
  Has,
  HasValue,
  getComponentValueStrict,
  runQuery,
} from "@latticexyz/recs";
import { RoomState } from "../constants";
import { useEntityQuery } from "@latticexyz/react";
import styled from "styled-components";
import { StyledButton, StyledContainer } from "../globalStyles";
import { WindowHeader } from "./WindowHeader";

export const GameCenter = () => {
  const {
    components: { Room, State, Game, RoomLimit },
    network: { playerEntity, singletonEntity },
    systemCalls: { joinRoom, createRoom },
  } = useMUD();

  const pendingRooms = useEntityQuery([
    HasValue(State, { value: `${RoomState.PENDING}` }),
  ]).map((entity) => {
    const gameAddress = getComponentValueStrict(Game, entity)?.value;
    const roomLimit = getComponentValueStrict(
      RoomLimit,
      entity
    )?.value.toString();
    const players = [...runQuery([HasValue(Room, { value: entity })])];
    return { gameAddress, roomLimit, players };
  });

  const [showJoinRoomPopup, setShowJoinRoomPopup] = useState(false);
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [gameAddress, setGameAddress] = useState("");
  const [roomLimit, setRoomLimit] = useState(0);

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

      <PendingRoomsContainer>
        {pendingRooms.map((room, i) => {
          return (
            <div key={i}>
              Playing {room.gameAddress}, Players: {room.players.length} /{" "}
              {room.roomLimit}
            </div>
          );
        })}
      </PendingRoomsContainer>
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

const PendingRoomsContainer = styled.div``;

const Button = styled.button`
  -webkit-border-radius: 12;
  -moz-border-radius: 12;
  border-radius: 8px;
  color: #ffffff;
  background: #00cf9f;
  padding: 15px 25px 15px 25px;
  text-decoration: none;
  border: none;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
    background: #00b89f;
    text-decoration: none;
  }
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
