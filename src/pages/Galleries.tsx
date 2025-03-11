import "../index.css";
import { getAllGalleries } from "../sanity";
import { useEffect, useState } from "react";
import { Album, Title, PageLayout } from "../components";
import styled from "styled-components";

function Posts() {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    getAllGalleries().then((galleries) => {
      setGalleries(galleries);
    });
  }, []);

  return (
    <PageLayout>
      <Container>
        <ContentContainer>
          <Title text="Galerija" />
            <PostsWrapper>
              {galleries.length > 0 &&
                galleries.map((gallery: any) => (
                  <Album
                    slug={gallery.slug.current}
                    key={gallery._id}
                    title={gallery.title}
                    date={gallery.publishedAt}
                    image={gallery.coverImage}
                  />
                ))}
            </PostsWrapper>
        </ContentContainer>
      </Container>
    </PageLayout>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  margin-top:20px;
  display: flex;
  flex-direction: column;
  width: 85%;
  max-width: 1024px;
`;

const PostsWrapper = styled.div`
margin-top: 1rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  flex-direction: column;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;

    > * {
      flex: none;
      width: 45%;
    }
  }
`;

export default Posts;
