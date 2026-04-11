import "../index.css";
import { getAllGalleries } from "../sanity";
import { useEffect, useState, useRef } from "react";
import { Album, Title, PageLayout } from "../components";
import styled from "styled-components";

function Posts() {
  const [groupedGalleries, setGroupedGalleries] = useState<{ [key: string]: any[] }>({});
  const [, setRerender] = useState({});
  const prevUrlRef = useRef(window.location.href);

  useEffect(() => {
    const checkUrlChange = setInterval(() => {
      if (window.location.href !== prevUrlRef.current) {
        prevUrlRef.current = window.location.href;
        setRerender({});
      }
    }, 50);
    
    return () => clearInterval(checkUrlChange);
  }, []);

  useEffect(() => {
    getAllGalleries().then((galleries) => {
      const groups = galleries.reduce((acc: any, gallery: any) => {
        const yearMatch = gallery.title.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : "Other";

        if (!acc[year]) acc[year] = [];
        acc[year].push(gallery);
        return acc;
      }, {});

      // Sort godine
      Object.keys(groups).forEach(year => {
        groups[year].sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      });

      setGroupedGalleries(groups);
    });
  }, []);

  //Dobivanje godina
  const searchParams = new URLSearchParams(window.location.search);
  const queryYear = searchParams.get("year");

  const sortedYears = Object.keys(groupedGalleries).sort((a, b) => b.localeCompare(a));
  const yearsToDisplay = queryYear && groupedGalleries[queryYear] ? [queryYear] : sortedYears;

  return (
    <PageLayout>
      <Container>
        <ContentContainer>
          <Title text="Galerija" />
          
          {yearsToDisplay.map((year) => (
            <YearSection key={year}>
              <YearDivider>
                <h2>{year}</h2>
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