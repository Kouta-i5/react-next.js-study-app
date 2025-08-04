'use client';

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import { Link } from "@/components/Link";
import styles from "@/styles/page.module.css";
import Head from "next/head";

export default function Home() {
  const handleClick = () => {
    alert("pageページでボタンが押されました。")
  };

  return (
    <div className={styles.page}>
      <Header />
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Headline title="Home" click={handleClick}>
          <code className={styles.code}>pages.jsだよ</code>
        </Headline>
        <Link />
      </main>
      <Footer />
    </div>
  );
}
