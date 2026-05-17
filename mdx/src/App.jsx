import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Hello, { title, date, author } from './posts/hello.mdx'

// Optional: define custom renderers for Markdown elements
const components = {
  h1: (props) => <h1 style={{ color: 'teal' }} {...props} />,
  p: (props) => <p style={{ fontSize: '18px', lineHeight: '1.6' }} {...props} />,
}

export default function App() {
  return (
    <MDXProvider components={components}>
      <article style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
        <header>
          <h1>{title}</h1>
          <p>
            <strong>{author}</strong> — {date}
          </p>
        </header>
        <Hello />
      </article>
    </MDXProvider>
  )
}
