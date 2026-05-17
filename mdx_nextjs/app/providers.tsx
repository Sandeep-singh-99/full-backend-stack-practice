"use client";

import type { ReactNode } from "react";
import { MDXProvider } from "@mdx-js/react";

const components = {
  h1: (props: any) => <h1 style={{ color: "tomato" }} {...props} />,
};

export default function Providers({ children }: { children: ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
