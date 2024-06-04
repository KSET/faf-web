import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import { Link } from "wouter";
import ssfer from "../../assets/ssfer.png";
import kset from "../../assets/kset.png";

type Props = {
  useBackground?: boolean;
};

export const Footer = ({useBackground = true}: Props) => {
  const links = [
    { name: "facebook", link: "https://www.facebook.com/profile.php?id=61559876610924" },
    { name: "instagram", link: "https://www.instagram.com/fafzagreb/" },
    { name: "faf@kset.org", link: "mailto:faf@kset.org" },
    { name: "press@kset.org", link: "mailto:press@kset.org" }
  ];

  return (
    <>
      <Container useBackground={useBackground}>
        <Link href="/">
          <StyledLogo src={Logo} />
        </Link>
        <Links>
          {links.map((link) => {
            return <a href={link.link} target="_blank">{link.name}</a>;
          })}
        </Links>
        <Logos>
          <a href="https://www.ssfer.hr/" target="_blank"><img src={ssfer} alt="ssfer" /></a>
          <a href="https://www.kset.org/" target="_blank"><img src={kset} alt="kset" /></a>
        </Logos>
        Sva prava pridržana © {new Date().getFullYear()} <br/> Savez studenata FER-a
      </Container>
    </>
  );
};

const Container = styled.div<{ useBackground: boolean }>`
  background-color: ${(props) => (props.useBackground ? "#FFC73F" : "transparent")};
text-align: center;
    font-family: "Montserrat";
    font-weight: 600;
  margin-top: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 30px;
`;

const StyledLogo = styled.img`
  height: 100px;
  margin: 30px 0 15px;
`;

const Links = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 30px;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  a {
    color: #000;
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

const Logos = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
