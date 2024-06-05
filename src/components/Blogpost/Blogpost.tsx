import styled from "styled-components";
import { Link } from "wouter";
import { urlFor, formatDate } from "../../sanity";

type Props = {
  title: string;
  date: string;
  image: {};
  slug: string;
};

export const Blogpost = ({ title, date, image, slug }: Props) => {
  return (
    <Container href={`/post/${slug}`}>

        <StyledImg src={urlFor(image)} alt={title} />

      <Content>
        <Title>{title}</Title>
        <Date>{formatDate(date)}</Date>
      </Content>
    </Container>
  );
};



const StyledImg = styled.img`
  width: 100%;
`;

const Container = styled(Link)`
  background-color: white;
  width: 100%;
  line-height: normal;
  display: flex;
  flex-direction: column;
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
  overtflow-wrap: break-word;
`;

const Date = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
`;

export default Blogpost;
