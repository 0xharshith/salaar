import { Html, Head, Main, NextScript } from 'next/document'
import { init } from "@airstack/airstack-react";

init("1b9b64e439f204b7094c8becaedbe927d");
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
