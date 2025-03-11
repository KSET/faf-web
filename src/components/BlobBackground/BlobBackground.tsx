import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const Container = styled.div`
opacity: 0.9;
 border-bottom: 3px solid black;
  position: absolute;
  z-index: -5;
  top: 0;
  left: 0;
  width: 100%;
  height: 90vh; 
  overflow: hidden;
  background-color: #fdba74;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GooSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const BlobBackground = () => {
  const numBlobs = 20;
  const [blobs, setBlobs] = useState<
    { id: number; x: number; y: number; scale: number }[]
  >([]);

  useEffect(() => {
    const generatePosition = (existing: typeof blobs) => {
      let attempts = 0;
      while (attempts < 100) {
        const x = Math.random() * 90 + 5;
        const y = Math.random() * 90 + 5;
        const scale = Math.random() * 0.4 + 0.7;
        const overlaps = existing.some((b) => {
          const dist = Math.hypot(b.x - x, b.y - y);
          return dist < (10 * b.scale + 10 * scale) * 0.9;
        });
        if (!overlaps) return { x, y, scale };
        attempts++;
      }
      return null;
    };

    const newBlobs = [];
    for (let i = 0; i < numBlobs; i++) {
      const pos = generatePosition(newBlobs);
      if (pos) newBlobs.push({ id: i, ...pos });
    }
    setBlobs(newBlobs);
  }, []);

  return (
    <Container>
      <GooSVG
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 16 -6"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>

          <radialGradient
            id="blobGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="90%" stopColor="#ff7777" />
            {/* <stop offset="100%" stopColor="#fe9377" /> */}
          </radialGradient>
        </defs>
        <g filter="url(#goo)">
          {blobs.map((blob) => (
            <motion.circle
              key={blob.id}
              cx={blob.x}
              cy={blob.y}
              r={10 * blob.scale}
              fill="url(#blobGradient)"
              animate={{
                cx: [blob.x, blob.x + (Math.random() - 0.5) * 6, blob.x],
                cy: [blob.y, blob.y + (Math.random() - 0.5) * 6, blob.y],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: Math.random() * 4 + 8,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      </GooSVG>
    </Container>
  );
};
