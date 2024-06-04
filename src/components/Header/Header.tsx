import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Eye from "../../assets/eye.svg";
import { Link } from "wouter";

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      // Scrolling down
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <Container isVisible={isVisible}>
        <Wrapper>
          <Link href="/">
            <StyledLogo src={Eye} />
          </Link>
        </Wrapper>
      </Container>
    </>
  );
};

const Container = styled.div<{ isVisible: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffc73f;
  position: sticky;
  top: 0;
  z-index: 1000;
  transform: ${({ isVisible }) =>
    isVisible ? "translateY(0)" : "translateY(-100%)"};
  transition: transform 0.3s ease-in-out;
`;

const Wrapper = styled.div`
  width: 85%;
  max-width: 1024px;
`;

const StyledLogo = styled.img`
  height: 100px;
  margin: 30px 0 15px;
`;
