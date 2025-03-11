import styled from "styled-components";
import "../index.css";
import { useEffect, useState } from "react";
import { getGallery } from "../sanity";
import { useParams } from "wouter";
import { urlFor, dimensionsFor } from "../sanity";
import { PageLayout } from "../components";
import { Helmet } from "react-helmet";
import { Gallery as RGG } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function Gallery() {
  const params = useParams();

  const [gallery, setGallery] = useState({
    title: "",
    images: [],
    coverImage: {},
  });

  const [images, setImages] = useState([]);

  const [index, setIndex] = useState(-1);

  const handleClick = (index: number) => setIndex(index);

  useEffect(() => {
    if (!params.slug) return;
    getGallery(params.slug).then((gallery) => {
      setGallery(gallery);

      setImages(
        gallery.images.map((image: any) => ({
          src: urlFor(image),
          ...dimensionsFor(image),
        }))
      );
    });
  }, []);

  useEffect(() => {
    console.log(images);
  }, [images]);

  return (
    <>
      <Helmet>
        <title>{gallery.title} - Festival amaterskog filma</title>
        <meta
          name="description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
        <meta
          property="og:title"
          content={`${gallery.title} - Festival amaterskog filma`}
        />
        <meta
          property="og:description"
          content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
        />
      </Helmet>
      <PageLayout>
        <Container>
          <Content>
            <Title>{gallery.title}</Title>

            <RGG
              images={images}
              onClick={handleClick}
              enableImageSelection={false}
            />

            <Lightbox
              slides={images}
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
            />
          </Content>
        </Container>
      </PageLayout>
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

export const Content = styled.div`
  margin-top: 20px;
  width: 85%;
  max-width: 1024px;
  font-family: "Montserrat";
  font-weight: 500;
`;

const Title = styled.h1`
  margin: 10px 0;
  font-size: 25px;
`;

export default Gallery;
