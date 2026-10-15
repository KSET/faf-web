import styled from "styled-components";
import "../index.css";
import { useEffect, useState } from "react";
import { getTimeslot } from "../sanity";
import { useParams } from "wouter";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../sanity";
import { PageLayout } from "../components";
import { Helmet } from "react-helmet";

function Timeslot() {
  const params = useParams();

  const [loading, setLoading] = useState(true); 

  const [timeslot, setTimeslot] = useState({
    title: "",
    startTime: "",
    endTIme: "",
    body: [],
    movies: [],
    mainImage: "",
    publishedAt: "",
  });

  useEffect(() => {
    if (!params.slug) return;

    setLoading(true);

    getTimeslot(params.slug).then((timeslot) => {
      setTimeslot(timeslot);
       setLoading(false);
    });
  }, []);

  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) {
          return null;
        }
        return (
          <Image alt={value.alt || " "} loading="lazy" src={urlFor(value)} />
        );
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{timeslot.title} - Festival amaterskog filma</title>
        <meta
          name="description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
        <meta
          property="og:title"
          content={`${timeslot.title} - Festival amaterskog filma`}
        />
        <meta
          property="og:description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
        <meta property="og:image" content={urlFor(timeslot.mainImage, 200)} />
      </Helmet>
      <PageLayout>
        <Container>
        {loading ? ( 
            <Spinner /> 
          ) : (
          <Content>
            <Title>{timeslot.title}</Title>
            <Time>
              {new Date(timeslot.startTime).toLocaleString("hr-HR", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Time>
            <PortableText value={timeslot.body} components={ptComponents} />

            <MoviesContainer>
              {timeslot.movies &&
                timeslot.movies.map((movie: any) => (
                  <Movie key={movie._id}>
                    <MovieImage
                      alt={movie.title}
                      loading="lazy"
                      src={urlFor(movie.poster)}
                    />
                    <MovieContentContainer>
                      <MovieTitle>{movie.title}</MovieTitle>
                      <DirectorAndDuration>
                        {movie.directorandduration}
                      </DirectorAndDuration>
                      <MovieDescription>{movie.description}</MovieDescription>
                    </MovieContentContainer>
                  </Movie>
                ))}
            </MoviesContainer>
          </Content>
          )}
        </Container>
      </PageLayout>
    </>
  );
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 0;
`;

const Image = styled.img`
  max-width: 100%;
`;

export const Content = styled.div`
  width: 90%;
  max-width: 1024px;
  padding: 1.5rem;
  color: #000;
  background-color: rgba(255, 255, 255, 0.94);
  border: 2px solid #000;
  box-shadow: 8px 10px 0 #000;
  box-sizing: border-box;
  font-family: "Montserrat";
  font-weight: 500;
  font-size: 1.05rem;
  line-height: 1.7;

  p {
    margin: 0 0 1rem;
  }

  a {
    color: #7c2458;
    font-weight: 700;
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
  }

  @media (min-width: 768px) {
    padding: 2rem 2.5rem;
  }
`;

const Title = styled.h1`
  margin: 0 0 1rem;
  color: #000;
  font-size: clamp(2rem, 5vw, 2.5rem);
  line-height: 1.2;
`;

const Time = styled.p`
  display: inline-block;
  padding: 0.5rem 0.85rem;
  color: #000;
  background-color: #e374b1;
  border: 1px solid #000;
  box-shadow: 4px 4px 0 #000;
  font-size: clamp(1rem, 3vw, 1.25rem);
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 1.5rem;
`;

const MoviesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`;

const Movie = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #000;
  background-color: #fff;
  padding: 1rem;
  gap: 1rem;
  border: 2px solid #000;
  box-shadow: 8px 10px 0px -2px #000;
  width: 100%;

  @media (min-width: 768px) {
    gap: 2rem;
    flex-direction: row;
    padding: 1.5rem 2rem;
  }
`;

const MovieImage = styled.img`
  max-width: 100%;

  @media (min-width: 768px) {
    max-width: 35%;
  }
`;

const MovieContentContainer = styled.div`
  padding: 0 1rem;
  
  @media (min-width: 768px) {
    padding: 0 0;
  }
`;

const DirectorAndDuration = styled.div`
  font-size: 15px;
  line-height: 1.5;
`;

const MovieTitle = styled.h2`
  font-size: 30px;
  margin: 5px 0;
  line-height: 1.2;
  word-break: break-word;
`;

const MovieDescription = styled.p`
  font-size: 20px;
  line-height: 1.6;
`;

const Spinner = styled.div`
  border: 8px solid #a7ce64;
  border-top: 8px solid #fe7677;
  border-radius: 50%;
  width: 50px; 
  height: 50px; 
  animation: spin 1s linear infinite;
  margin-top: 10rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


export default Timeslot;
