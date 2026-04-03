import "../index.css";
import { getAllGalleries } from "../sanity";
import { useEffect, useState } from "react";
import { Album, Title, PageLayout } from "../components";
import styled from "styled-components";

function Posts() {
  const [groupedGalleries, setGroupedGalleries] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    getAllGalleries().then((galleries) => {
      const groups = galleries.reduce((acc: any, gallery: any) => {
        const yearMatch = gallery.title.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "Other";

        if (!acc[year]) acc[year] = [];
        acc[year].push(gallery);
        return acc;
      }, {});

      setGroupedGalleries(groups);
    });
  }, []);

  const sortedYears = Object.keys(groupedGalleries).sort((a, b) => b.localeCompare(a));

  return (
    <PageLayout>
      <Container>
        <ContentContainer>
          <Title text="Galerija" />
          
          {sortedYears.map((year) => (
            <YearSection key={year}>
              <YearDivider>
                <h2>{year}</h2>
                <div className="line" />
              </YearDivider>
              
              <PostsWrapper>
                {groupedGalleries[year].map((gallery: any) => (
                  <AlbumItem key={gallery._id}>
                    <Album
                      slug={gallery.slug.current}
                      title={gallery.title}
                      date={gallery.publishedAt}
                      image={gallery.coverImage}
                    />
                  </AlbumItem>
                ))}
              </PostsWrapper>
            </YearSection>
          ))}
        </ContentContainer>
      </Container>
    </PageLayout>
  );
}


const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  margin-top: 20px;
  width: 90%;
  max-width: 1200px;
`;

const YearSection = styled.section`
  margin-bottom: 4rem;
`;

const YearDivider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-family: "Montserrat";
  h2 {
    font-size: 2rem;
    margin: 0 1.5rem 0 0;
    color: #222;
  }

  .line {
    flex-grow: 1;
    height: 1px;
    background-color: #eee;
  }
`;

const PostsWrapper = styled.div`
  display: flex;
  flex-direction: row; /* Stack horizontally */
  flex-wrap: wrap;    /* Allow jumping to next line */
  gap: 2rem;          /* Space between items */
  justify-content: flex-start;
`;

const AlbumItem = styled.div`
  flex: 0 0 100%; 

  @media (min-width: 600px) {
    flex: 0 0 calc(50% - 1rem); 
  }


`;

export default Posts;