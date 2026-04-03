import "../index.css";
import { getAllPosts } from "../sanity";
import { useEffect, useState } from "react";
import { Blogpost, Title, PageLayout } from "../components";
import styled from "styled-components";

function Arhiva() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts().then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <PageLayout>
      <Container>
        <ContentContainer>
          <Title text="Arhiva" />
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
              {posts.length === 0 && (
                <NoPostsMessage>Nema starih postova</NoPostsMessage>
              )}
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
  margin-top: 20px;
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

const NoPostsMessage = styled.div`
  text-align: center;
  color: #666;
  padding: 2rem;
`;

export default Arhiva;
