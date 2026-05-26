import { useEffect, useRef, useState } from "react";
import {
  Title,
  Blogpost,
  Logo,
  PageLayout,
} from "../components";
import styled from "styled-components";
import "../index.css";
import { getAllPosts, getAllTimeslots } from "../sanity";
import { Link } from "wouter";
import React from "react";
import { Button } from "../components";
interface Timeslot {
  _id: string;
  title: string;
  slug?: { current: string; _type: string } | null;
  isClickable: boolean | null;
  startTime: string;
  endTime: string;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: string;
}

const groupByDate = (timeslots: Timeslot[]) => {
  const groupedTimeslots = timeslots.reduce<Record<string, Timeslot[]>>(
    (acc, timeslot) => {
      const startDate = new Date(timeslot.startTime);

      const formattedDate = startDate.toISOString().split("T")[0];

      const subotaDate = "2025-10-18";

      const dateLabel = formattedDate === subotaDate ? "subota" : "nedjelja";

      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }

      acc[dateLabel].push(timeslot);
      return acc;
    },
    {}
  );

  Object.keys(groupedTimeslots).forEach((date) =>
    groupedTimeslots[date].sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    })
  );

  return groupedTimeslots;
};

const calculateEventHeight = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return durationInHours * 100;
};

const groupPostsByYear = (posts: Post[]) => {
  return posts.reduce<Record<string, Post[]>>((groupedPosts, post) => {
    const year = new Date(post.publishedAt).getFullYear().toString();

    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }

    groupedPosts[year].push(post);
    return groupedPosts;
  }, {});
};

const HalftoneBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      vx: number;
      vy: number;
    }[]
  >([]);
  const isMobileRef = useRef(false);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    const pixelRatio = window.devicePixelRatio || 1;

    const createBouncingParticles = (width: number, height: number) => {
      const particleCount = Math.max(
        300,
        Math.min(180, Math.round((width * height) / 9000))
      );

      particlesRef.current = Array.from({ length: particleCount }, () => {
        const radius = 4 + Math.random() * 11;
        const speed = 0.12 + Math.random() * 0.34;
        const angle = Math.random() * Math.PI * 2;

        return {
          x: radius + Math.random() * Math.max(1, width - radius * 2),
          y: radius + Math.random() * Math.max(1, height - radius * 2),
          radius,
          opacity: 0.28 + Math.random() * 0.42,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      isMobileRef.current = window.matchMedia(
        "(pointer: coarse), (max-width: 767px)"
      ).matches;

      if (isMobileRef.current) {
        particlesRef.current = [];
      } else if (
        particlesRef.current.length === 0 ||
        canvasSizeRef.current.width !== rect.width ||
        canvasSizeRef.current.height !== rect.height
      ) {
        createBouncingParticles(rect.width, rect.height);
      }

      canvasSizeRef.current = { width: rect.width, height: rect.height };
    };

    const drawHalftoneField = (
      centerX: number,
      centerY: number,
      radius: number,
      maxDot: number,
      spacing: number,
      rotation: number
    ) => {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation);
      context.fillStyle = "#5263b6";

      for (let y = -radius; y <= radius; y += spacing) {
        for (let x = -radius; x <= radius; x += spacing) {
          const distance = Math.hypot(x, y);
          if (distance > radius) continue;

          const fade = 1 - distance / radius;
          const wave = 0.78 + Math.sin((x + y) * 0.03) * 0.12;
          const dotRadius = Math.max(1.2, maxDot * fade * wave);

          context.globalAlpha = Math.min(0.9, 0.18 + fade * 0.85);
          context.beginPath();
          context.arc(x, y, dotRadius, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.restore();
      context.globalAlpha = 1;
    };

    const drawParticles = (width: number, height: number) => {
      context.fillStyle = "#405bb2";

      particlesRef.current = particlesRef.current.map((particle) => {
        let nextX = particle.x + particle.vx;
        let nextY = particle.y + particle.vy;
        let nextVx = particle.vx;
        let nextVy = particle.vy;

        if (nextX - particle.radius < 0 || nextX + particle.radius > width) {
          nextVx *= -1;
          nextX = Math.min(Math.max(nextX, particle.radius), width - particle.radius);
        }

        if (nextY - particle.radius < 0 || nextY + particle.radius > height) {
          nextVy *= -1;
          nextY = Math.min(Math.max(nextY, particle.radius), height - particle.radius);
        }

        context.globalAlpha = particle.opacity;
        context.beginPath();
        context.arc(nextX, nextY, particle.radius, 0, Math.PI * 2);
        context.fill();

        return {
          ...particle,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy,
        };
      });

      context.globalAlpha = 1;
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      context.clearRect(0, 0, width, height);

      if (isMobileRef.current) {
        drawHalftoneField(width * 0.86, height * 0.18, width * 0.22, 13, 23, -0.12);
        drawHalftoneField(width * 0.63, height * 0.58, width * 0.34, 12, 21, -0.22);
        drawHalftoneField(width * 0.18, height * 0.93, width * 0.28, 12, 22, -0.28);
      } else {
        drawParticles(width, height);
      }

      animationFrame = requestAnimationFrame(render);
    };

    resizeCanvas();
    render();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <HalftoneCanvas ref={canvasRef} aria-hidden="true" />;
};

const App = () => {
  const [eyePosition, setEyePosition] = useState<{ cx: number; cy: number }>({
    cx: 197,
    cy: 48.5,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [visibleOlderYearCount, setVisibleOlderYearCount] = useState(0);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const postsWrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllPosts().then((posts) => {
      setPosts(posts);
    });

    getAllTimeslots().then(timeslots => {
      setTimeslots(timeslots);
      
      const date = new Date();
      const isOct19 = date.getFullYear() === 2025 && 
                     date.getMonth() === 9 && 
                     date.getDate() === 19;
      
      setSelectedDate(isOct19 ? "nedjelja" : "subota");
    });
    }, []);


    const scrollPostsLeft = () => {
    if (postsWrapperRef.current) {
      postsWrapperRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
      });
    }
  };


  const scrollPostsRight = () => {
    if (postsWrapperRef.current) {
      postsWrapperRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const groupedTimeslots = groupByDate(timeslots);
  const postsByYear = groupPostsByYear(posts);
  const currentYear = new Date().getFullYear().toString();
  const currentYearPosts = postsByYear[currentYear] ?? [];
  const olderYears = Object.keys(postsByYear)
    .filter((year) => Number(year) < Number(currentYear))
    .sort((a, b) => Number(b) - Number(a));
  const visibleOlderYears = olderYears.slice(0, visibleOlderYearCount);
  const hasMoreOlderYears = visibleOlderYearCount < olderYears.length;
  const hasExpandedNews = visibleOlderYearCount > 0;
  const visibleCurrentYearPosts = hasExpandedNews
    ? currentYearPosts
    : currentYearPosts.slice(0, 3);

  useEffect(() => {
    // Teleofni oko
    const isTouchDevice = () => {
      return (
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia("(pointer:coarse)").matches)
      );
    };

    if (isTouchDevice()) {
      return;
    }

    let lastUpdateTime = 0;
    const throttleMs = 16; // cca 60 fpsa, da malo ustedi na bateriji lapitopija

    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      const now = performance.now();
      if (now - lastUpdateTime < throttleMs) return;
      lastUpdateTime = now;

      const svg = document.getElementById("logo");
      if (!svg) return;

      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const svgX = ((event.clientX - rect.left) / rect.width) * 237;
      const svgY = ((event.clientY - rect.top) / rect.height) * 105;

      const eyeCenterX = 194.5;
      const eyeCenterY = 42;
      const maxEyeMovement = 5;

      const deltaX = svgX - eyeCenterX;
      const deltaY = svgY - eyeCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 0) {
        const clampedDistance = Math.min(distance, maxEyeMovement);
        const newEyeX = eyeCenterX + (deltaX / distance) * clampedDistance;
        const newEyeY = eyeCenterY + (deltaY / distance) * clampedDistance;
        setEyePosition({ cx: newEyeX, cy: newEyeY });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <PageLayout useBackgroundForFooter={false} isHomePage={true}>
        <HeroSection>
          <HalftoneBackground />
          <HeroContainer>
            <PosterLogo>
              <Logo eyePosition={eyePosition} />
            </PosterLogo>
            <PosterTitleContainer>
              <FirstLine>Festival</FirstLine>
              <MiddleLine>amaterskog</MiddleLine>
              <SecondLine>filma</SecondLine>
            </PosterTitleContainer>

            <DateLocationContainer>
              <StyledDate>17. - 18. 10. 2026.</StyledDate>
              <Location>Klub Močvara</Location>
            </DateLocationContainer>
            
            <ButtonWrapper>
              <Button text="prijavi film" color="pink" link="/prijave" bold/>
            </ButtonWrapper> 
          </HeroContainer>
        </HeroSection>

        <ContentSection>
          <ContentWrapper>
            <SectionWrapper>
              <Title text="O FAF-u" />
              <Text>
                Festival Amaterskog Filma - za prijatelje FAF, festival je u
                organizaciji studenata koji svoju ljubav prema amaterskom filmu
                žele proširiti po cijelom svijetu. <br />
                <br /> Cijeli svijet je daleko...a Zagreb imamo kod kuće pa nam
                se u potrazi za najboljim (amaterskim) filmovima regije možeš
                pridružiti u Klubu Močvara 17. i 18. listopada 2026.<br />
                <br />
              </Text>
            </SectionWrapper>

            {timeslots.length > 0 && (
              <SectionWrapper>
                <Title text="Raspored" />

                <DateChooser>
                  {Object.keys(groupedTimeslots).map((date) => (
                    <DateButton
                      key={date}
                      isSelected={selectedDate === date}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </DateButton>
                  ))}
                </DateChooser>

                <TimetableWrapper>
                  {selectedDate &&
                    groupedTimeslots[selectedDate] &&
                    groupedTimeslots[selectedDate].map((timeslot) => (
                      <StyledLink
                        href={
                          timeslot.isClickable && timeslot.slug?.current
                            ? `timeslot/${timeslot.slug?.current}`
                            : ""
                        }
                        key={timeslot._id}
                      >
                        <TimeSlotContainer
                          height={calculateEventHeight(
                            timeslot.startTime,
                            timeslot.endTime
                          )}
                        >
                          <TimeLabel>
                            {new Date(timeslot.startTime).toLocaleTimeString(
                              "hr-HR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </TimeLabel>
                          <EventLabel>{timeslot.title}</EventLabel>
                        </TimeSlotContainer>
                      </StyledLink>
                    ))}
                </TimetableWrapper>
              </SectionWrapper>
            )}

            {currentYearPosts.length > 0 && (
              <NewsSectionWrapper>
                <TitleWithScrollIndicator>
                  <Title text="Novosti" />
                  {!hasExpandedNews && (
                  <ScrollIndicators>
                    <ScrollArrow onClick={scrollPostsLeft}>←</ScrollArrow>
                    <ScrollArrow onClick={scrollPostsRight}>→</ScrollArrow>
                  </ScrollIndicators>
                  )}
                </TitleWithScrollIndicator>
                <YearTitle>{currentYear}</YearTitle>
                <PostsWrapper ref={postsWrapperRef} $isExpanded={hasExpandedNews}>
                  {visibleCurrentYearPosts.map((post) => (
                      <Blogpost
                        slug={post.slug.current}
                        key={post._id}
                        title={post.title}
                        date={post.publishedAt}
                        image={post.mainImage}
                        isHome={true}
                      />
                  ))}
                </PostsWrapper>
                {visibleOlderYears.map((year) => (
                  <YearSection key={year}>
                    <YearTitle>{year}</YearTitle>
                    <ExpandedPostsWrapper>
                      {postsByYear[year].map((post) => (
                        <Blogpost
                          slug={post.slug.current}
                          key={post._id}
                          title={post.title}
                          date={post.publishedAt}
                          image={post.mainImage}
                          isHome={true}
                        />
                      ))}
                    </ExpandedPostsWrapper>
                  </YearSection>
                ))}
                <ButtonWrapper>
                  {hasMoreOlderYears && (
                    <LoadMoreButton
                      type="button"
                      onClick={() =>
                        setVisibleOlderYearCount((count) => count + 1)
                      }
                    >
                      {hasExpandedNews ? "Prikaži još" : "pročitaj sve"}
                    </LoadMoreButton>
                  )}
                </ButtonWrapper>
              </NewsSectionWrapper>
            )}
          </ContentWrapper>
        </ContentSection>
    </PageLayout>
  );
};

const HeroSection = styled.div`
  position: relative;
  min-height: 92vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #76a7e5;
  border-bottom: 3px solid #000;
  isolation: isolate;
`;

const HalftoneCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const ContentSection = styled.div`
  position: relative;
  width: 100%;
  padding-top: 80px;
  z-index: 10;
`;

const HeroContainer = styled.div`
  display: flex;
  width: min(82%, 620px);
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 58px 0 18px;
  z-index: 1;

  @media (min-width: 768px) {
    width: min(66%, 720px);
    padding: 58px 0 12px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
`;

const SectionWrapper = styled.div`
  width: 85%;
  max-width: 768px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NewsSectionWrapper = styled.div`
  width: 100%;
  max-width: 768px;
  margin-bottom: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (max-width: 767px) {
    width: 85%;
  }
`;

const YearSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 767px) {
    align-items: center;
  }
`;

const YearTitle = styled.h2`
  width: 85%;
  color: #000;
  font-family: "Akira";
  font-size: 24px;
  font-weight: normal;
  margin: 0;

  @media (max-width: 767px) {
    text-align: center;
  }

  @media (min-width: 768px) {
    width: 100%;
    font-size: 30px;
  }
`;

const PostsWrapper = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  overflow-x: ${(props) => (props.$isExpanded ? "visible" : "auto")};
  flex-wrap: ${(props) => (props.$isExpanded ? "wrap" : "nowrap")};
  flex-direction: row;
  padding: 0.5rem 0.5rem 1rem 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: thin; /* For Firefox */
  scroll-behavior: smooth; 

  @media (max-width: 767px) {
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    overflow-x: visible;
    padding-left: 0;
    padding-right: 0;
  }

  & > *:first-child {
    margin-left: ${(props) => (props.$isExpanded ? "0" : "0.5rem")};
  }

  & > *:last-child {
    margin-right: 0.5rem;
  }

  @media (max-width: 767px) {
    & > *:first-child,
    & > *:last-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
`;

const ExpandedPostsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 0.5rem 0.5rem 1rem 0;
  box-sizing: border-box;

  @media (max-width: 767px) {
    align-items: center;
    padding-left: 0;
    padding-right: 0;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    padding-left: 0;
    padding-right: 0;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const LoadMoreButton = styled.button`
  width: fit-content;
  background-color: #e374b1;
  color: #000;
  border: 2px solid #000;
  box-shadow: 8px 10px 0px -2px #000;
  font-size: 15px;
  font-family: "Montserrat";
  padding: 1rem 2rem;
  transition: 0.3s;
  margin-top: 2rem;
  font-weight: 600;
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


const PosterLogo = styled.div`
  width: min(82%, 430px);
  margin-bottom: 2rem;
  padding: 0 1.8rem 1.8rem 0;

  > div {
    width: 100%;
    max-width: none;
  }

  @media (min-width: 768px) {
    width: min(54%, 450px);
    margin-left: 0.3rem;
  }
`;

const PosterTitleContainer = styled.div`
  font-family: "Akira";
  color: #f8f8f8;
  text-transform: uppercase;
  line-height: 0.92;
  letter-spacing: 0;
  -webkit-text-stroke: 2px #000;
  text-shadow: 7px 8px 0 #000;
  margin-bottom: 2rem;

`;

const FirstLine = styled.div`
  font-size: 2.35rem;

  @media (min-width: 768px) {
    font-size: 3.8rem;
  }

  @media (min-width: 1100px) {
    font-size: 4.8rem;
  }
`;

const MiddleLine = styled.div`
  font-size: 2rem;

  @media (min-width: 768px) {
    font-size: 3.8rem;
  }

  @media (min-width: 1100px) {
    font-size: 4.8rem;
  }
`;

const SecondLine = styled.div`
  font-size: 3rem;

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }

  @media (min-width: 1100px) {
    font-size: 5.7rem;
  }
`;

const DateLocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  font-family: "Montserrat";
  font-size: 1.8rem;
  color: #000;
  margin-left: 0.35rem;

  @media (min-width: 768px) {
    font-size: 2.35rem;
  }

  @media (min-width: 1100px) {
    font-size: 2.8rem;
  }
`;

const TitleWithScrollIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85%;

  @media (min-width: 768px) {
    width: 100%;

    & > div:last-child {
      display: none;
    }
  }
`;

const ScrollIndicators = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ScrollArrow = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 1px solid #000;
  border-radius: 50%;
  box-shadow: 3px 3px 0px 0px #000;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;

  &:active {
    transform: translateY(2px) translateX(2px);
    box-shadow: 1px 1px 0px 0px #000;
  }

  &:hover {
    background-color: #e8e8e8;
  }
`;

const Location = styled.div`
  background-color: #e374b1;
  box-shadow: 8px 8px 0 #000;
  border: 1px solid #d35b9a;
  font-weight: 500;
  line-height: 1;
  min-width: 12rem;
  padding: 0.55rem 1.5rem 0.7rem;
`;

const StyledDate = styled.div`
  background-color: #e374b1;
  box-shadow: 8px 8px 0 #000;
  border: 1px solid #d35b9a;
  font-weight: 500;
  line-height: 1;
  min-width: 14rem;
  padding: 0.55rem 1.5rem 0.7rem;
`;

const Text = styled.div`
  font-family: "Montserrat";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  padding-left: 15px;

  @media (min-width: 768px) {
    font-size: 17px;
  }
`;

const TimetableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateChooser = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const DateButton = styled.div<{ isSelected: boolean }>`
  flex-grow: 1;
  text-align: center;
  background-color: ${(props) => (props.isSelected ? "#a7ce64" : "#fe7677")};
  color: ${(props) => (props.isSelected ? "#fff" : "#000")};
  border: 2px solid #000;
  box-shadow: 8px 10px 0px -2px #000;
  font-size: 15px;
  font-family: "Montserrat";
  padding: 0.5rem 1rem;
  transition: 0.3s;
  font-weight: 600;
  font-variant: all-small-caps;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    box-shadow: 4px 5px 0px -1px #000;
    transform: translateY(0.2rem) translateX(0.2rem);
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

const TimeSlotContainer = styled.div<{ height: number }>`
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 0.5rem 1rem;
  color: #000;
  font-family: "Montserrat";
  height: ${(props) => props.height}px;
  border: 1px solid #000;
  box-shadow: 5px 5px 0px 0px #000;
  cursor: pointer;
  transition: 0.3s;
  align-items: center;
  text-decoration: none;

  &:hover {
    box-shadow: 2px 2px 0px -1px #000;
    transform: translateY(0.2rem) translateX(0.2rem);
  }
`;

const TimeLabel = styled.div`
  font-weight: normal;
`;

const EventLabel = styled.div`
  font-weight: 700;
  font-size: 17px;
  max-width: 60%;
  text-align: right;
`;

export default App;
