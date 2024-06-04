import styled from "styled-components";
import Eye from "../../assets/eye.svg";
import { Link } from "wouter";

export const Header = () => {
  return (
    <>

      <Container>
        <Wrapper>
          <Link href="/">
          <StyledLogo src={Eye} />
          </Link>
        </Wrapper>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  width:100%;
  top:0;
  display: flex;
  justify-content: center;
  align-items: center;
  mix-blend-mode: multiply;
  background-color: #FFC73F;
  /* border-bottom: 10px solid #000; */
`;

const Wrapper = styled.div`
  width: 85%;
  max-width: 1024px;
`;

const StyledLogo = styled.img`
  height: 100px;
  margin: 30px 0 15px;
`;
