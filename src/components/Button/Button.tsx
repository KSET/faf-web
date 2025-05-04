import styled from "styled-components";
import { Link } from "wouter";

type Props = {
  text: string;
  color?: "red" | "orange";
  link: string;
  bold?: boolean;
};

const AutoLink = ({ href, ...rest }: any) => {
  const LinkComponent = href.includes("://") ? "a" : Link;
  return <LinkComponent href={href} {...rest} />;
};

export const Button = ({ text, color = "red", link, bold }: Props) => {
  return (
    <StyledButton color={color} href={link} bold={bold}>
      {text}
    </StyledButton>
  );
};

const StyledButton = styled(AutoLink)<{ color: string, bold?: boolean }>`
  width: fit-content;
  background-color: ${(props) =>
    props.color === "red" ? "#a7ce64" : "#fe7677"};
  color: ${(props) => (props.color === "red" ? "#fff" : "#000")};
  border: 2px solid #000;
  box-shadow: 8px 10px 0px -2px #000;
  font-size: 15px;
  font-family: "Montserrat";
  padding: 1rem 2rem;
  transition: 0.3s;
  margin-top: 2rem;
  font-weight: ${(props) => (props.bold ? 800 : 600)};
  font-variant: all-small-caps;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    box-shadow: 4px 5px 0px -1px #000;
    transform: translateY(0.5rem) translateX(0.5rem);
  }

  @media (min-width: 768px) {
    font-size: 24px;
  }
`;
