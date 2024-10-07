import styled from "styled-components";
import "../index.css";
import { useEffect, useState } from "react";
import { getTimeslot } from "../sanity";
import { useParams } from "wouter";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../sanity";
import { Footer, Header } from "../components";
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
      <Header />
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
      <Footer />
    </>
  );
}

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  max-width: 100%;
`;

export const Content = styled.div`
  margin-top: 20px;
  width: 85%;
  max-width: 1024px;
  font-family: "Montserrat";
  font-weight: 500;
`;

const Title = styled.h1`
  margin: 10px 0 0px;
  font-size: 40px;
`;

const Time = styled.p`
  font-size: 25px;
  color: #666;
  margin: 0 0 2rem;
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
  background-color: #f9f9f9;
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
`;

const MovieTitle = styled.h2`
  font-size: 30px;
  margin: 5px 0;
word-break: break-word;
`;

const MovieDescription = styled.p`
  font-size: 20px;
`;

const Spinner = styled.div`
  border: 8px solid #FF3640;
  border-top: 8px solid #FFC73F;
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
