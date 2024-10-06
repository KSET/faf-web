import styled from "styled-components";
import "../index.css";
import { useEffect, useState } from "react";
import { formatDate, getPost } from "../sanity";
import { useParams } from "wouter";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../sanity";
import { Footer, Header } from "../components";
import { Helmet } from "react-helmet";

function Post() {
  const params = useParams();
  console.log(params);

  const [post, setPost] = useState({
    title: "",
    body: [],
    mainImage: "",
    publishedAt: "",
  });

  useEffect(() => {
    if (!params.slug) return;
    getPost(params.slug).then((post) => {
      setPost(post);
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
        <title>{post.title} - Festival amaterskog filma</title>
        <meta
          name="description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
        <meta property="og:title" content={`${post.title} - Festival amaterskog filma`} />
        <meta
          property="og:description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
        <meta
          property="og:image"
          content={urlFor(post.mainImage)}
        />
      </Helmet>
      <Header />
      <Container>
        <Content>
          <Title>{post.title}</Title>
          <PublishedAt>Objavljeno {formatDate(post.publishedAt)}</PublishedAt>
          <PortableText value={post.body} components={ptComponents} />
        </Content>
      </Container>
      <Footer />
    </>
  );
}

export const PublishedAt = styled.p`
  font-size: 15px;
  color: #666;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  max-width: 100%;
`;

export const Content = styled.div`
  margin-top:20px;
  width: 85%;
  max-width: 1024px;
  font-family: "Montserrat";
  font-weight: 500;
`;

const Title = styled.h1`
  margin: 10px 0;
  font-size: 50px;
`;

export default Post;
