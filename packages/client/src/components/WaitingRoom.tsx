import styled from "styled-components";
import { StyledButton, StyledContainer } from "../globalStyles";
import { useEntityQuery } from "@latticexyz/react";
import { useMUD } from "../MUDContext";
import { Entity, HasValue, getComponentValueStrict } from "@latticexyz/recs";
import { WindowHeader } from "./WindowHeader";
import Gixi from "gixi";

export const WaitingRoom = ({ room }: { room: string }) => {
  const {
    components: { Room, RoomLimit, Game },
    network: { playerEntity, singletonEntity },
    systemCalls: { leaveRoom, startGame },
  } = useMUD();

  const players = useEntityQuery([HasValue(Room, { value: room })]);
  const roomEntity = room as Entity;
  const gameAddress = getComponentValueStrict(Game, roomEntity)?.value;
  const roomLimit = getComponentValueStrict(
    RoomLimit,
    roomEntity
  )?.value?.toString();

  const renderPlayers = () => {
    const playerAvatars = players.reduce(
      (idToAvatar: Record<string, string>, player: string) => {
        const avatar = new Gixi(30).getImage();
        idToAvatar[player] = avatar;
        return idToAvatar;
      },
      {}
    );
    return players.map((player, i) => {
      return (
        <Player key={i}>
          <div>Player {i + 1}</div>
          <img src={playerAvatars[player]} />
          <Address>{player}</Address>
        </Player>
      );
    });
  };

  return (
    <WaitingRoomContainer>
      <WindowHeader title="Waiting Room" onClose={leaveRoom} />
      <InnerContainer>
        {Number(roomLimit) - players.length > 0 ? (
          <>
            <Title>
              Waiting for {Number(roomLimit) - players.length} player(s) start{" "}
              {`Minecollector`}...
            </Title>
            <LoadingContainer>
              <img src="src/public/loading.gif" width={60} height={60} />
            </LoadingContainer>
          </>
        ) : null}
        <div>
          Game Address: <Address>{gameAddress}</Address>
        </div>
        <PlayersContainer>{renderPlayers()}</PlayersContainer>
        <ButtonContainer>
          <StyledButton
            onClick={startGame}
            disabled={players.length !== Number(roomLimit)}
          >
            Start Game
          </StyledButton>
          <StyledButton onClick={leaveRoom}>Leave Room</StyledButton>
        </ButtonContainer>
      </InnerContainer>
    </WaitingRoomContainer>
  );
};

const WaitingRoomContainer = styled(StyledContainer)`
  display: flex;
  flex-direction: column;
  width: 800px;
  height: 600px;
  position: relative;
  align-items: center;
  color: black;
`;

const LoadingContainer = styled.div`
  width: 60px;
  height: 60px;
  align-self: center;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  width: 80%;
  height: 100%;
`;

const Title = styled.div`
  align-self: center;
`;

const Address = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Player = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > * {
    margin-right: 10px;
  }
`;

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin: 10px 0;
  }
`;

const ButtonContainer = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`;
