import styled from "styled-components";
import {Link } from "wouter";
import { urlFor, formatDate } from "../../sanity";

type Props = {
  title: string;
  date: string;
  image: {};
  slug: string;
};

export const Blogpost = ({ title, date, image, slug }: Props) => {

  return (
    <Container image={urlFor(image)} href={`/post/${slug}`}>
      <Content>
        <Title>{title}</Title>
        <Date>{formatDate(date)}</Date>
      </Content>
    </Container>
  );
};

const Container = styled(Link)<{ image: string }>`
  height: 200px;
  
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.58) 100%
    ),
    url(${(props) => props.image}) #FF3640 90% / cover no-repeat;
  color: #fff;
  font-family: Montserrat;

  line-height: normal;
  display: flex;
  align-items: flex-end;
  border: 1px solid #000;
  box-shadow: 10px 10px 0px 0px #000;
  cursor: pointer;
  transition: 0.3s;
  text-decoration: none;

  &:hover {
    box-shadow: 5px 5px 0px -1px #000;
    transform: translateY(0.5rem) translateX(0.5rem);
  }
  @media (min-width: 768px) {
    flex: 1 1 0px;
    height: 300px;
  }
`;


const Content = styled.div`
  padding: 20px 20px 0;
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 700;
  font-size: 23px;
`;

const Date = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
`;

export default Blogpost;
