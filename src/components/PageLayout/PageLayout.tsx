import { ReactNode } from 'react';
import styled from 'styled-components';
import { Footer, Header } from '..';
import { useLocation } from 'wouter';

interface PageLayoutProps {
  children: ReactNode;
  useBackgroundForFooter?: boolean;
  isHomePage?: boolean;
}

export const PageLayout = ({ 
  children, 
  useBackgroundForFooter = true,
  isHomePage = false
}: PageLayoutProps) => {
  const [location] = useLocation();
  const isHome = isHomePage || location === '/';

  return (
    <PageContainer>
      <Header isHome={isHome} />
      <MainContent>
        {children}
      </MainContent>
      <Footer useBackground={useBackgroundForFooter} />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
`;

const MainContent = styled.main`
  flex: 1 0 auto; 
  display: flex;
  flex-direction: column;
`;