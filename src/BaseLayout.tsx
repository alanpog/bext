import type { FC } from "hono/jsx";

const BaseLayout: FC = (props) => (
  <html lang="en">
    <head>
      <link rel="stylesheet" href="/public/globals.css" hx-preserve="true" />
      <link rel="icon" type="image/png" href="/public/favicon.png" />
      <script
        src="https://unpkg.com/htmx.org@1.9.10"
        hx-preserve="true"
      ></script>
      <script
        src="https://unpkg.com/htmx.org/dist/ext/head-support.js"
        hx-preserve="true"
      ></script>
      <title>Bext.Dev</title>
    </head>
    <body hx-boost="true">{props.children}</body>
  </html>
);

export default BaseLayout;
