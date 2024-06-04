import { Button, Blobs, Title, Blogpost, Logo, Footer } from "../components";
import styled from "styled-components";
import "../index.css";
import { useEffect, useState } from "react";
import { getFrontpagePosts } from "../sanity";

function App() {
  const [eyePosition, setEyePosition] = useState({ cx: 194.714, cy: 42.3506 });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getFrontpagePosts().then((posts) => {
      setPosts(posts);
    });
  }, []);

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
    <>
      <Blobs />
      <HeroContainer>
        <Logo eyePosition={eyePosition} />
        <TitleContainer>
          <FirstLine>Festival amaterskog</FirstLine>
          <SecondLine>filma</SecondLine>
        </TitleContainer>
        <Button
          text="prijavi svoj film  >"
          link={import.meta.env.VITE_APPLICATION_FORM_URL}
        />
      </HeroContainer>

      <ContentContainer>
        <ContentWrapper>
          <SectionWrapper>
            <Title text="O FAF-u" />
            <Text>
              Festival Amaterskog Filma - za prijatelje FAF, festival je u
              organizaciji studenata koji svoju ljubav prema amaterskom filmu
              žele proširiti po cijelom svijetu. U potrazi za najboljim
              amaterskim filmovima regije pridruži nam se u Klubu Močvara 11. i
              12. listopada 2024.
              <br />
              <br />
              Gledamo se uskoro....
            </Text>
          </SectionWrapper>
          <SectionWrapper>
            <Title text="Novosti" />

            <PostsWrapper>
              {posts.length > 0 &&
                posts.map((post: any) => (
                  <Blogpost
                    slug={post.slug.current}
                    key={post._id}
                    title={post.title}
                    date={post.publishedAt}
                    image={post.mainImage}
                  />
                ))}
            </PostsWrapper>
            <ButtonWrapper>
              <Button text="pročitaj sve" color="orange" link="/posts" />
            </ButtonWrapper>
          </SectionWrapper>
        </ContentWrapper>
      </ContentContainer>
      <Footer useBackground={false} />
    </>
  );
}

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200px;
  padding-bottom: 200px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const PostsWrapper = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
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

export default App;
