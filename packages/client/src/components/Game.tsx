import styled from "styled-components";
import { StyledButton, StyledContainer } from "../globalStyles";

export const Game = ({ room }: { room: string }) => {
  return (
    <GameContainer>
      <iframe
        src={`http://localhost:3001/?roomId=${room}`}
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </GameContainer>
  );
};

const GameContainer = styled(StyledContainer)`
  width: 80%;
  height: 80%;
`;
