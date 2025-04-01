import { useState, useEffect } from "react";
import styled from "styled-components";
import Eye from "../../assets/eye.svg";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  isHome?: boolean;
}

export const Header = ({ isHome = false }: HeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

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
    // Only add scroll listener for non-home header (sticky header)
    if (!isHome) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollY, isHome]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {isHome ? (
        // Home transparent header
        <TransparentContainer menuOpen={menuOpen}>
          <Wrapper>
            <HomeNavContainer>
              <DesktopNav>
                <NavLink href="/" isActive={location === "/"}>
                  Početna
                </NavLink>
                <NavLink
                  href="/posts"
                  isActive={location === "/posts" || location.startsWith("/post/")}
                >
                  Novosti
                </NavLink>
                <NavLink
                  href="/galerije"
                  isActive={location === "/galerije" || location.startsWith("/galerija/")}
                >
                  Galerija
                </NavLink>
              </DesktopNav>

              <HamburgerButton onClick={toggleMenu}>
                <HamburgerIcon menuOpen={menuOpen}>
                  <span></span>
                  <span></span>
                  <span></span>
                </HamburgerIcon>
              </HamburgerButton>
            </HomeNavContainer>
          </Wrapper>

          <MobileMenu menuOpen={menuOpen}>
            <NavLink href="/" isActive={location === "/"} onClick={closeMenu}>
              Početna
            </NavLink>
            <NavLink
              href="/posts"
              isActive={location === "/posts" || location.startsWith("/post/")}
              onClick={closeMenu}
            >
              Novosti
            </NavLink>
            <NavLink
              href="/galerije"
              isActive={location === "/galerije" || location.startsWith("/galerija/")}
              onClick={closeMenu}
            >
              Galerija
            </NavLink>
          </MobileMenu>
        </TransparentContainer>
      ) : (
        // Regular sticky header
        <Container isVisible={isVisible} menuOpen={menuOpen}>
          <Wrapper>
            <NavContainer>
              <Link href="/">
                <StyledLogo src={Eye} />
              </Link>

              <DesktopNav>
                <NavLink href="/" isActive={location === "/"}>
                  Početna
                </NavLink>
                <NavLink
                  href="/posts"
                  isActive={location === "/posts" || location.startsWith("/post/")}
                >
                  Novosti
                </NavLink>
                <NavLink
                  href="/galerije"
                  isActive={location === "/galerije" || location.startsWith("/galerija/")}
                >
                  Galerija
                </NavLink>
              </DesktopNav>

              <HamburgerButton onClick={toggleMenu}>
                <HamburgerIcon menuOpen={menuOpen}>
                  <span></span>
                  <span></span>
                  <span></span>
                </HamburgerIcon>
              </HamburgerButton>
            </NavContainer>
          </Wrapper>

          <MobileMenu menuOpen={menuOpen}>
            <NavLink href="/" isActive={location === "/"} onClick={closeMenu}>
              Početna
            </NavLink>
            <NavLink
              href="/posts"
              isActive={location === "/posts" || location.startsWith("/post/")}
              onClick={closeMenu}
            >
              Novosti
            </NavLink>
            <NavLink
              href="/galerije"
              isActive={
                location === "/galerije" || location.startsWith("/galerija/")
              }
              onClick={closeMenu}
            >
              Galerija
            </NavLink>
          </MobileMenu>
        </Container>
      )}
    </>
  );
};

// Shared styled components
const BaseContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  z-index: 1000;
`;

// Regular header container
const Container = styled(BaseContainer)<{ isVisible: boolean; menuOpen: boolean }>`
  background-color: #fe7677;
  position: sticky;
  top: 0;
  transform: ${({ isVisible }) =>
    isVisible ? "translateY(0)" : "translateY(-100%)"};
  transition: transform 0.3s ease-in-out;
`;

// Transparent header container for homepage
const TransparentContainer = styled(BaseContainer)<{ menuOpen: boolean }>`
  background-color: ${({ menuOpen }) => menuOpen ? '#fe7677' : 'transparent'};
  position: absolute;
  top: 0;
  transition: background-color 0.3s ease-in-out;
`;

const Wrapper = styled.div`
  width: 85%;
  max-width: 1024px;
  position: relative;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HomeNavContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const StyledLogo = styled.img`
  height: 80px;
  margin: 10px 0;
`;

const DesktopNav = styled.nav`
  display: none;
  gap: 2rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: ${({ isActive }) => (isActive ? "#000" : "#333")};
  text-decoration: ${({ isActive }) => (isActive ? "underline" : "none")};
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

const HamburgerButton = styled.button`
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const HamburgerIcon = styled.div<{ menuOpen: boolean }>`
  width: 30px;
  height: 20px;
  position: relative;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #000;
    border-radius: 3px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: ${({ menuOpen }) => (menuOpen ? "9px" : "0px")};
      transform: ${({ menuOpen }) =>
        menuOpen ? "rotate(45deg)" : "rotate(0)"};
    }

    &:nth-child(2) {
      top: 9px;
      opacity: ${({ menuOpen }) => (menuOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      top: ${({ menuOpen }) => (menuOpen ? "9px" : "18px")};
      transform: ${({ menuOpen }) =>
        menuOpen ? "rotate(-45deg)" : "rotate(0)"};
    }
  }
`;

const MobileMenu = styled.nav<{ menuOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fe7677;
  padding: ${({ menuOpen }) => (menuOpen ? "1rem 0" : "0")};
  max-height: ${({ menuOpen }) => (menuOpen ? "300px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  z-index: 1000;

  a {
    padding: 0.8rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    text-align: center;

    &:last-child {
      border-bottom: none;
    }
  }

  @media (min-width: 768px) {
    display: none;
  }
`;
