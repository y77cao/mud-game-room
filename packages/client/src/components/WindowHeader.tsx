import React from "react";
import styled from "styled-components";
import { StyledButton } from "../globalStyles";

export const WindowHeader = ({
  title,
  onClose,
  children = null,
}: {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <HeaderWrapper>
      <div style={{ margin: "0 4px" }}>{title}</div>
      <ButtonsWrapper>
        {children}
        <HeaderButton
          onClick={() => {
            onClose();
          }}
        >
          X
        </HeaderButton>
      </ButtonsWrapper>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: grey;
  color: white;
  align-self: flex-start;
  position: absolute;
  top: 0;
`;

const HeaderButton = styled(StyledButton)`
  margin: 2px;
  width: 35px;
  height: 25px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
