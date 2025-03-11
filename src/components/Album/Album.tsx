import styled from "styled-components";
import { Link } from "wouter";
import { urlFor, formatDate } from "../../sanity";

type Props = {
  title: string;
  date: string;
  image: {};
  slug: string;
};

export const Album = ({ title, date, image, slug }: Props) => {
  return (
    <Container href={`/gallery/${slug}`}>
      <ImageWrapper>
        <StyledImg src={urlFor(image)} alt={title} />
        <Title>{title}</Title>
      </ImageWrapper>
    </Container>
  );
};

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledImg = styled.img`
  width: 100%;
  display: block;
`;

const Container = styled(Link)`
  background-color: white;
  width: 100%;
  line-height: normal;
  border: 1px solid #000;
  box-shadow: 10px 10px 0px 0px #000;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;
  align-items: center;

  &:hover {
    box-shadow: 5px 5px 0px -1px #000;
    transform: translateY(0.5rem) translateX(0.5rem);
  }
  @media (min-width: 768px) {
    width: 30%;
  }
`;

const Title = styled.h1`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export default Album;
