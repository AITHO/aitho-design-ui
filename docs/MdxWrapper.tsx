import React, { ReactNode } from "react";
import { styled } from "storybook/theming";

const Wrapper = styled.div`
  font-family: "Arial", sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 20px;
  width: 100%;
  margin: 0 auto;

  h1 {
    color: #0000ad;
    border-bottom: 2px solid #0000ad;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #3377ff;
    margin-top: 30px;
  }

  p {
    margin-bottom: 15px;
  }

  code {
    background-color: #f4f4f4;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: "Courier New", Courier, monospace;
  }

  pre {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
  }

  a {
    color: #00d9ea;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  ul,
  ol {
    padding-left: 20px;
    margin-bottom: 15px;
  }

  blockquote {
    border-left: 4px solid #0000ad;
    padding-left: 15px;
    margin-left: 0;
    font-style: italic;
    color: #666;
  }
`;

export const CustomMDXWrapper = ({ children }: { children: ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);
