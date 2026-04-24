import { useState, useEffect } from "react";
import styled from "styled-components";
import Eye from "../../assets/eye.svg";
import { Link, useLocation } from "wouter";
import { getAllGalleries, getArchivePosts } from "../../sanity";

interface HeaderProps {
  isHome?: boolean;
}

export const Header = ({ isHome = false }: HeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const [galleryYears, setGalleryYears] = useState<string[]>([]);
  const [archiveYears, setArchiveYears] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<"galerija" | "arhiva" | null>(null);

  useEffect(() => {
    // Lista gelerija
    getAllGalleries().then((galleries) => {
      const years = new Set<string>();
      galleries.forEach((gallery: any) => {
        const yearMatch = gallery.title.match(/\d{4}/);
        if (yearMatch) {
          years.add(yearMatch[0]);
        }
      });
      const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
      setGalleryYears(sortedYears);
    });

    // Lista objava
    getArchivePosts().then((posts) => {
      const years = new Set<string>();
      posts.forEach((post: any) => {
        const year = new Date(post.publishedAt).getFullYear().toString();
        years.add(year);
      });
      const sortedYears = Array.from(years).sort((a, b) => b.localeCompare(a));
      setArchiveYears(sortedYears);
    });
  }, []);

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
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (dropdown: "galerija" | "arhiva") => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleYearSelect = () => {
    setOpenDropdown(null);
  };

  return (
    <>
      {isHome ? (
        // Home transparent header
        <TransparentContainer $menuOpen={menuOpen}>
          <Wrapper>
            <HomeNavContainer>
              <DesktopNav>
                <NavLink href="/" $isActive={location === "/"}>
                  Početna
                </NavLink>
                <NavLink
                  href="/posts"
                  $isActive={location === "/posts" || location.startsWith("/post/")}
                >
                  Novosti
                </NavLink>
                <DropdownContainer>
                  <DropdownButton onClick={() => handleDropdownToggle("galerija")} $isOpen={openDropdown === "galerija"}>
                    Galerija
                  </DropdownButton>
                  {openDropdown === "galerija" && (
                    <DropdownMenu>
                      {galleryYears.map((year) => (
                        <DropdownItem key={year} as={Link} href={`/galerije?year=${year}`} onClick={handleYearSelect}>
                          {year}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  )}
                </DropdownContainer>
                <DropdownContainer>
                  <DropdownButton onClick={() => handleDropdownToggle("arhiva")} $isOpen={openDropdown === "arhiva"}>
                    Arhiva
                  </DropdownButton>
                  {openDropdown === "arhiva" && (
                    <DropdownMenu>
                      {archiveYears.map((year) => (
                        <DropdownItem key={year} as={Link} href={`/arhiva?year=${year}`} onClick={handleYearSelect}>
                          {year}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  )}
                </DropdownContainer>
              </DesktopNav>

              <HamburgerButton onClick={toggleMenu}>
                <HamburgerIcon $menuOpen={menuOpen}>
                  <span></span>
                  <span></span>
                  <span></span>
                </HamburgerIcon>
              </HamburgerButton>
            </HomeNavContainer>
          </Wrapper>

          <MobileMenu $menuOpen={menuOpen}>
            <NavLink href="/" $isActive={location === "/"} onClick={closeMenu}>
              Početna
            </NavLink>
            <NavLink
              href="/posts"
              $isActive={location === "/posts" || location.startsWith("/post/")}
              onClick={closeMenu}
            >
              Novosti
            </NavLink>
            <MobileDropdownContainer>
              <DropdownButton onClick={() => handleDropdownToggle("galerija")} $isOpen={openDropdown === "galerija"}>
                Galerija {openDropdown === "galerija" ? "▼" : "▶"}
              </DropdownButton>
              {openDropdown === "galerija" && (
                <MobileDropdownMenu>
                  {galleryYears.map((year) => (
                    <DropdownItem key={year} as={Link} href={`/galerije?year=${year}`} onClick={closeMenu}>
                      {year}
                    </DropdownItem>
                  ))}
                </MobileDropdownMenu>
              )}
            </MobileDropdownContainer>
            <MobileDropdownContainer>
              <DropdownButton onClick={() => handleDropdownToggle("arhiva")} $isOpen={openDropdown === "arhiva"}>
                Arhiva {openDropdown === "arhiva" ? "▼" : "▶"}
              </DropdownButton>
              {openDropdown === "arhiva" && (
                <MobileDropdownMenu>
                  {archiveYears.map((year) => (
                    <DropdownItem key={year} as={Link} href={`/arhiva?year=${year}`} onClick={closeMenu}>
                      {year}
                    </DropdownItem>
                  ))}
                </MobileDropdownMenu>
              )}
            </MobileDropdownContainer>
          </MobileMenu>
        </TransparentContainer>
      ) : (
        // Regular sticky header
        <Container $isVisible={isVisible} $menuOpen={menuOpen}>
          <Wrapper>
            <NavContainer>
              <Link href="/">
                <StyledLogo src={Eye} />
              </Link>

              <DesktopNav>
                <NavLink href="/" $isActive={location === "/"}>
                  Početna
                </NavLink>
                <NavLink
                  href="/posts"
                  $isActive={location === "/posts" || location.startsWith("/post/")}
                >
                  Novosti
                </NavLink>
                <DropdownContainer>
                  <DropdownButton onClick={() => handleDropdownToggle("galerija")} $isOpen={openDropdown === "galerija"}>
                    Galerija
                  </DropdownButton>
                  {openDropdown === "galerija" && (
                    <DropdownMenu>
                      {galleryYears.map((year) => (
                        <DropdownItem key={year} as={Link} href={`/galerije?year=${year}`} onClick={handleYearSelect}>
                          {year}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  )}
                </DropdownContainer>
                <DropdownContainer>
                  <DropdownButton onClick={() => handleDropdownToggle("arhiva")} $isOpen={openDropdown === "arhiva"}>
                    Arhiva
                  </DropdownButton>
                  {openDropdown === "arhiva" && (
                    <DropdownMenu>
                      {archiveYears.map((year) => (
                        <DropdownItem key={year} as={Link} href={`/arhiva?year=${year}`} onClick={handleYearSelect}>
                          {year}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  )}
                </DropdownContainer>
              </DesktopNav>

              <HamburgerButton onClick={toggleMenu}>
                <HamburgerIcon $menuOpen={menuOpen}>
                  <span></span>
                  <span></span>
                  <span></span>
                </HamburgerIcon>
              </HamburgerButton>
            </NavContainer>
          </Wrapper>

          <MobileMenu $menuOpen={menuOpen}>
            <NavLink href="/" $isActive={location === "/"} onClick={closeMenu}>
              Početna
            </NavLink>
            <NavLink
              href="/posts"
              $isActive={location === "/posts" || location.startsWith("/post/")}
              onClick={closeMenu}
            >
              Novosti
            </NavLink>
            <MobileDropdownContainer>
              <DropdownButton onClick={() => handleDropdownToggle("galerija")} $isOpen={openDropdown === "galerija"}>
                Galerija {openDropdown === "galerija" ? "▼" : "▶"}
              </DropdownButton>
              {openDropdown === "galerija" && (
                <MobileDropdownMenu>
                  {galleryYears.map((year) => (
                    <DropdownItem key={year} as={Link} href={`/galerije?year=${year}`} onClick={closeMenu}>
                      {year}
                    </DropdownItem>
                  ))}
                </MobileDropdownMenu>
              )}
            </MobileDropdownContainer>
            <MobileDropdownContainer>
              <DropdownButton onClick={() => handleDropdownToggle("arhiva")} $isOpen={openDropdown === "arhiva"}>
                Arhiva {openDropdown === "arhiva" ? "▼" : "▶"}
              </DropdownButton>
              {openDropdown === "arhiva" && (
                <MobileDropdownMenu>
                  {archiveYears.map((year) => (
                    <DropdownItem key={year} as={Link} href={`/arhiva?year=${year}`} onClick={closeMenu}>
                      {year}
                    </DropdownItem>
                  ))}
                </MobileDropdownMenu>
              )}
            </MobileDropdownContainer>
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

//TU STOJI BOJA ZA HEADER
// Regular header container
const Container = styled(BaseContainer)<{ $isVisible: boolean; $menuOpen: boolean }>`
  background-color: #6080C9; 
  position: sticky;
  top: 0;
  transform: ${({ $isVisible }) =>
    $isVisible ? "translateY(0)" : "translateY(-100%)"};
  transition: transform 0.3s ease-in-out;
`;

// Transparent header container for homepage
const TransparentContainer = styled(BaseContainer)<{ $menuOpen: boolean }>`
  background-color: ${({ $menuOpen }) => $menuOpen ? '#6080C9' : 'transparent'};
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

const NavLink = styled(Link)<{ $isActive: boolean }>`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: ${({ $isActive }) => ($isActive ? "#000" : "#333")};
  text-decoration: ${({ $isActive }) => ($isActive ? "underline" : "none")};
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.87);

  &:hover {
    text-decoration: underline;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button<{ $isOpen: boolean }>`
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: #333;
  color: rgba(255, 255, 255, 0.87);

  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-decoration: none;
  line-height: 1;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 767px) {
    width: 100%;
    text-align: center;
    padding: 0.8rem 1.5rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: block;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 120px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  margin-top: 0.5rem;
`;

const MobileDropdownMenu = styled.div`
  width: 100%;
  background-color: #f5f5f5;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.8rem 1.2rem;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;

  &:hover {
    background-color: #f0f0f0;
    color: #000;
  }

  @media (max-width: 767px) {
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:last-child {
      border-bottom: none;
    }
  }
`;

const MobileDropdownContainer = styled.div`
  width: 100%;
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

const HamburgerIcon = styled.div<{ $menuOpen: boolean }>`
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
      top: ${({ $menuOpen }) => ($menuOpen ? "9px" : "0px")};
      transform: ${({ $menuOpen }) =>
        $menuOpen ? "rotate(45deg)" : "rotate(0)"};
    }

    &:nth-child(2) {
      top: 9px;
      opacity: ${({ $menuOpen }) => ($menuOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      top: ${({ $menuOpen }) => ($menuOpen ? "9px" : "18px")};
      transform: ${({ $menuOpen }) =>
        $menuOpen ? "rotate(-45deg)" : "rotate(0)"};
    }
  }
`;

const MobileMenu = styled.nav<{ $menuOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #6080C9;
  padding: ${({ $menuOpen }) => ($menuOpen ? "1rem 0" : "0")};
  max-height: ${({ $menuOpen }) => ($menuOpen ? "300px" : "0")};
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
