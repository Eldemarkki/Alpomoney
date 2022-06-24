import styled, { css, keyframes } from "styled-components";

const animation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const animationRule = css`
  ${animation} 1s infinite linear;
`;

interface SpinnerProps {
  size?: number,
  thickness?: number
}

export const Spinner = styled.div<SpinnerProps>`
  animation: ${animationRule};
  border-radius: 50%;
  width: ${props => props.size || 30}px;
  height: ${props => props.size || 30}px;
  border: ${props => props.thickness || 3}px solid black;
  border-right: ${props => props.thickness || 3}px solid transparent;
  transform: rotate(90deg);
`;
