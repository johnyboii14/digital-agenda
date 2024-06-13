import React, { useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import type { MouseEvent, RefObject, HTMLAttributes } from 'react';

const ScrollButton = styled(IconButton)(() => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  backgroundColor: '#000',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#555',
  },
  zIndex: 1000,
}));

interface ScrollToTopProps extends HTMLAttributes<HTMLElement> {
  containerRef: RefObject<HTMLDivElement>;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ containerRef }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = (): void => {
    if (containerRef.current !== null) {
      const scrolled = containerRef.current.scrollTop;
      if (scrolled > 50) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  };

  const scrollToTop = (event: MouseEvent): void => {
    if (containerRef.current !== null) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container !== null) {
      container.addEventListener('scroll', toggleVisible);
    }
    return () => {
      if (container !== null) {
        container.removeEventListener('scroll', toggleVisible);
      }
    };
  }, [containerRef]);

  return (
    <ScrollButton
      onClick={scrollToTop}
      style={{ display: visible ? 'inline' : 'none' }}
    >
      <ArrowUpwardIcon />
    </ScrollButton>
  );
};

export default ScrollToTop;
