import styled from "styled-components";
import Logo from "../../assets/logo.svg";
import { Link } from "wouter";
import ssfer from "../../assets/ssfer-crni.svg";
import kset from "../../assets/kset-crni.svg";

type Props = {
  useBackground?: boolean;
};

export const Footer = ({ useBackground = true }: Props) => {
  const contactColumns = [
    {
      title: "FAF",
      links: [
        { name: "faf.kset.org", link: "https://faf.kset.org/" },
        { name: "faf@kset.org", link: "mailto:faf@kset.org" },
        {
          name: "facebook",
          link: "https://www.facebook.com/profile.php?id=61559876610924",
        },
        { name: "instagram", link: "https://www.instagram.com/fafzagreb/" },
      ],
    },
    {
      title: "KSET",
      links: [
        { name: "kset.org", link: "https://www.kset.org/" },
        { name: "info@kset.org", link: "mailto:info@kset.org" },
        { name: "facebook", link: "https://www.facebook.com/KSETZg" },
        { name: "instagram", link: "https://www.instagram.com/klubkset" },
      ],
    },
  ];

  return (
    <Container id="kontakti" $useBackground={useBackground}>
      <Link href="/">
        <StyledLogo src={Logo} />
      </Link>

      <Contacts>
        {contactColumns.map((column) => (
          <ContactColumn key={column.title}>
            <ContactTitle>{column.title}</ContactTitle>
            {column.links.map((link) => (
              <a key={`${column.title}-${link.name}`} href={link.link} target="_blank">
                {link.name}
              </a>
            ))}
          </ContactColumn>
        ))}
      </Contacts>

      <Address>Strojarska 12b</Address>

      <Logos>
        <a href="https://www.ssfer.hr/" target="_blank">
          <LogoSVG src={ssfer} alt="ssfer" />
        </a>
        <a href="https://www.kset.org/" target="_blank">
          <LogoSVG src={kset} alt="kset" />
        </a>
      </Logos>

      <Copyright>
        Sva prava pridržana © {new Date().getFullYear()} <br /> Savez studenata
        FER-a
      </Copyright>
    </Container>
  );
};

const Container = styled.div<{ $useBackground: boolean }>`
  background-color: ${(props) =>
    props.$useBackground ? "#6080C9" : "transparent"};
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
  scroll-margin-top: 120px;
`;

const StyledLogo = styled.img`
  height: 50px;
  margin: 30px 0 25px;
`;

const Contacts = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
  width: 85%;
  max-width: 620px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4rem;
  }
`;

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;

  a {
    color: rgba(255, 255, 255, 0.87);
    font-size: 1rem;
    font-weight: 600;
  }
`;

const ContactTitle = styled.h2`
  color: rgba(255, 255, 255, 0.87);
  font-family: "Akira";
  font-size: 1.3rem;
  font-weight: normal;
  margin: 0 0 0.4rem;
`;

const Address = styled.div`
  color: rgba(255, 255, 255, 0.87);
  margin-bottom: 28px;
`;

const Logos = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const LogoSVG = styled.img`
  height: 30px;
`;

const Copyright = styled.div`
  color: rgba(255, 255, 255, 0.87);
`;
