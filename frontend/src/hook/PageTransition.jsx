import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Transition } from 'react-transition-group';

const PageTransition = ({ children, locationKey }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {}, containerRef);
    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );
  };

  const onExit = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power3.in',
    });
  };

  return (
    <Transition
      key={locationKey}
      timeout={800}
      in
      appear
      onEnter={onEnter}
      onExit={onExit}
      nodeRef={containerRef}
    >
      <div ref={containerRef} className="page-container">
        {children}
      </div>
    </Transition>
  );
};

export default PageTransition;
