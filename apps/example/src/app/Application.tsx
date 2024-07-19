import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import './Application.scss'
import type { Extractor }from '../server/extractor'

type Props = {
  lang?: string
  scriptTags: string
  linkTags: string
}

function App({ lang= 'en', scriptTags, linkTags}: Props) {

  return (
    <html lang={lang}>
      <head>
      <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React Server Components</title>
        {scriptTags}
        {linkTags}
      </head>
      <body>
        <div id="root">
          <InnerApp />
        </div>
      </body>
    </html>
  )
}

export const InnerApp = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
          <div className="grid container">
            <div className="span-7">7</div>
            <div className="span-1">1</div>
            <div className="span-1">4</div>
          </div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR2
          Change here 14        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </>

  )
}

export default App
