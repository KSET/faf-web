import styled from "styled-components";
import { Link } from "wouter";
import { urlFor, formatDate } from "../../sanity";

type Props = {
  title: string;
  date: string;
  image: {};
  slug: string;
  isHome?: boolean;
};

export const Blogpost = ({ title, date, image, slug, isHome }: Props) => {
  return (
    <Container href={`/post/${slug}`} $isHome={isHome}>
      <StyledImg src={urlFor(image)} alt={title} />
      <Content>
        <Title>{title}</Title>
        <Date>{formatDate(date)}</Date>
      </Content>
    </Container>
  );
};

type ContainerProps = {
  $isHome?: boolean;
};

const Container = styled(Link)<ContainerProps>`
  background-color: white;
  width: 100%;
  max-width: ${({ $isHome }) => ($isHome && "300px")};
  flex: 0 0 auto;
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
    min-width: unset;
    max-width: unset;
    flex: 0 1 auto;
  }
`;

const StyledImg = styled.img`
  width: 100%;
`;

const Content = styled.div`
  color: black;
  font-family: Montserrat;
  padding: 0px 20px;
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Date = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
`;

export default Blogpost;
