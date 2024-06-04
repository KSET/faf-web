import styled from 'styled-components';
import blob from '../../assets/blob.svg';

export const Blobs = () => {


return (
    <Container>
      <Blob src={blob} alt="blob"/>
    </Container>
);
}

const Container = styled.div`
  position: fixed;
  width: 100vw;
  overflow: hidden;
  z-index: -1;
  display: flex;
  justify-content: center;
`;

const Blob = styled.img`
  width: 300%;
  position: relative;
  top: -50vw;
  left: -20vw;

  @media (min-width: 768px) {
    width: 200%;
    top: -50vw;
    left: -10vw;
  }


`;


