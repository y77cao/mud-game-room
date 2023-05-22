import styled from "styled-components";
import { StyledButton, StyledContainer } from "../globalStyles";
import { Entity } from "@latticexyz/recs";
import Gixi from "gixi";

export const PendingRoomCell = ({
  gameAddress,
  players,
  roomLimit,
  roomId,
  joinRoom,
}: {
  gameAddress: string;
  players: Entity[];
  roomLimit: string;
  roomId: string;
  joinRoom: (roomId: string) => void;
}) => {
  const renderAvatars = () => {
    const playerAvatars = players.reduce(
      (idToAvatar: Record<string, string>, player: string) => {
        const avatar = new Gixi(30).getImage();
        idToAvatar[player] = avatar;
        return idToAvatar;
      },
      {}
    );

    const avatars = [];
    for (let i = 0; i < Number(roomLimit); i++) {
      if (i < players.length) {
        avatars.push(
          <Avatar>
            <img src={playerAvatars[players[i]]} />
          </Avatar>
        );
      } else {
        avatars.push(<Avatar>?</Avatar>);
      }
    }

    return avatars;
  };

  return (
    <RoomContainer>
      <Title>Playing {`Minecollector`}</Title>
      <div>
        Game Address: <Address>{gameAddress}</Address>
      </div>
      <div>
        Players: {players.length} / {roomLimit}
      </div>
      <PlayerAvatarContainer>{renderAvatars()}</PlayerAvatarContainer>
      <CenterStyledButton onClick={() => joinRoom(roomId)}>
        Join
      </CenterStyledButton>
    </RoomContainer>
  );
};

const Title = styled.div`
  align-self: center;
`;

const CenterStyledButton = styled(StyledButton)`
  align-self: center;
`;

const RoomContainer = styled(StyledContainer)`
  display: flex;
  color: black;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;

  & > * {
    margin: 10px;
  }
`;

const Address = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const PlayerAvatarContainer = styled.div`
  display: flex;
  & > * {
    margin-right: 5px;
  }
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  background-color: darkgrey;
  display: flex;
  align-items: center;
  justify-content: center;
`;
