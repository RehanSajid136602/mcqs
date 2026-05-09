declare module "react-katex" {
  import React from "react";
  interface MathProps {
    math: string;
    block?: boolean;
    errorColor?: string;
    renderError?: boolean;
    settings?: object;
  }
  export const InlineMath: React.FC<MathProps>;
  export const BlockMath: React.FC<MathProps>;
}