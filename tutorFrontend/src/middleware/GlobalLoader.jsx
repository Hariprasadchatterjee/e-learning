import React from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const LoaderText = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-family: Arial, sans-serif;
  margin-top: 10px;
  animation: ${fadeIn} 1s infinite alternate;
`;

const LoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function GlobalLoader() {
  return (
    <LoaderWrapper>
      <LoaderContent>
        <Spinner />
        <LoaderText>Loading...</LoaderText>
      </LoaderContent>
    </LoaderWrapper>
  );
}

export default GlobalLoader;