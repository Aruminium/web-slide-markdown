import React from "react";
import Head from "next/head";
import Editor from "@monaco-editor/react";
import remark from "remark";
import parse from "remark-parse";
import remark2react from "remark-react";

import styles from "../styles/Home.module.css";

const initial = "# Write your own story";

export default function Home() {
  const [text, setText] = React.useState(initial);

  function handleChange(text) {
    setText(text);
  }

  return (
    <div>
      <Head>
        <title>WYSIWYG editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Editor
          height="100vh"
          width="50%"
          defaultLanguage="markdown"
          defaultValue={initial}
          onChange={handleChange}
        />
        <div className={styles.preview}>
          {remark().use(parse).use(remark2react).processSync(text).result}
        </div>
      </main>
    </div>
  );
}
