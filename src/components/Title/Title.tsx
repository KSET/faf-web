import styled from "styled-components";

type Props = {
  text: string;
};

export const Title = ({ text }: Props) => {
  return <StyledHeader>{text}</StyledHeader>;
};

const StyledHeader = styled.div`
  font-size: 25px;
  font-family: "Akira";
`;
