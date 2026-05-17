import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Hello from './posts/hello.mdx'


export default function App() {
  return (
    <MDXProvider>
      <Hello />
    </MDXProvider>
  )
}
