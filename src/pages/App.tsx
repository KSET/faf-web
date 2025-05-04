import { useEffect, useState } from "react";
import {
  Button,
  BlobBackground,
  Title,
  Blogpost,
  Logo,
  PageLayout,
} from "../components";
import styled from "styled-components";
import "../index.css";
import { getAllTimeslots, getFrontpagePosts } from "../sanity";
import { Link } from "wouter";
import React from "react";

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

      const petakDate = "2024-10-11";

      const dateLabel = formattedDate === petakDate ? "petak" : "subota";

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

const App = () => {
  const [eyePosition, setEyePosition] = useState<{ cx: number; cy: number }>({
    cx: 194.714,
    cy: 42.3506,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const postsWrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFrontpagePosts().then((posts) => {
      setPosts(posts);
    });

    getAllTimeslots().then((timeslots) => {
      setTimeslots(timeslots);
      setSelectedDate("subota");
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

  useEffect(() => {
    const handleMouseMove = (event: { clientX: number; clientY: number }) => {
      const svg = document.getElementById("eye");
      const rect = svg ? svg.getBoundingClientRect() : null;
      const svgX = event.clientX - (rect?.left || 0);
      const svgY = event.clientY - (rect?.bottom || 0);

      const eyeCenterX = 194.714;
      const eyeCenterY = 42.3506;
      const maxEyeMovement = 5;

      const deltaX = svgX - eyeCenterX;
      const deltaY = svgY - eyeCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const clampedDistance = Math.min(distance, maxEyeMovement);

      const newEyeX = eyeCenterX + (deltaX / distance) * clampedDistance;
      const newEyeY = eyeCenterY + (deltaY / distance) * clampedDistance;

      setEyePosition({ cx: newEyeX, cy: newEyeY });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <PageLayout useBackgroundForFooter={false} isHomePage={true}>
        <HeroSection>
          <BlobBackground />
          <HeroContainer>
            <Logo eyePosition={eyePosition} />
            <TitleContainer>
              <FirstLine>Festival amaterskog</FirstLine>
              <SecondLine>filma</SecondLine>
            </TitleContainer>

            <DateLocationContainer>
              <Location>KLUB MOČVARA</Location>
              <StyledDate>18. - 19. 10. 2025.</StyledDate>
            </DateLocationContainer>
            
            <ButtonWrapper>
              <Button text="prijavi film" color="orange" link="/prijave" bold/>
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
                pridružiti u Klubu Močvara 18. i 19. listopada 2025. <br />
                <br />
                Gledamo se uskoro...
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

            <NewsSectionWrapper>
              <TitleWithScrollIndicator>
                <Title text="Novosti" />
                <ScrollIndicators>
                  <ScrollArrow onClick={scrollPostsLeft}>←</ScrollArrow>
                  <ScrollArrow onClick={scrollPostsRight}>→</ScrollArrow>
                </ScrollIndicators>
              </TitleWithScrollIndicator>
              <PostsWrapper ref={postsWrapperRef}>
                {posts.length > 0 &&
                  posts.map((post) => (
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
              <ButtonWrapper>
                <Button text="pročitaj sve" color="orange" link="/posts" />
              </ButtonWrapper>
            </NewsSectionWrapper>
          </ContentWrapper>
        </ContentSection>
    </PageLayout>
  );
};

const HeroSection = styled.div`
  position: relative;
  height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentSection = styled.div`
  position: relative;
  width: 100%;
  padding-top: 80px;
  z-index: 10;
`;

const HeroContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200px;
  padding-bottom: 100px;
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
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const PostsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  overflow-x: auto;
  flex-wrap: nowrap;
  flex-direction: row;
  padding: 0.5rem 0.5rem 1rem 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: thin; /* For Firefox */
  scroll-behavior: smooth; 

  & > *:first-child {
    margin-left: 0.5rem;
  }

  & > *:last-child {
    margin-right: 0.5rem;
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const TitleContainer = styled.div`
  margin-top: 1.7rem;
  text-align: center;
  font-family: "Akira";
`;

const FirstLine = styled.div`
  font-size: 1.2rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const SecondLine = styled.div`
  font-size: 2.2rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const DateLocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-family: "Montserrat";
  font-size: 20px;
  margin-top: 40px;

  @media (min-width: 768px) {
    font-size: 20px;
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
  font-weight: 900;
`;

const StyledDate = styled.div`
  font-weight: 600;
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
