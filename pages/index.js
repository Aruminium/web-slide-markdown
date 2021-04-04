import Head from "next/head";
import Editor from "@monaco-editor/react";

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>WYSIWYG editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Editor
          height="100vh"
          defaultLanguage="markdown"
          defaultValue="# Write your own story"
        />
      </main>
    </div>
  );
}
