'use client';

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import { Link } from "@/components/Link";
import styles from "@/styles/page.module.css";
import { useEffect } from "react";

export default function Home() {
  const handleClick = () => {
    alert("pageページでボタンが押されました。")
    console.log("pageページでボタンが押されました。")
  };

  useEffect (() => {
    console.log("マウントされました。");
    document.body.style.backgroundColor = "lightblue";
    return () => {
      console.log("アンマウントされました");
    document.body.style.backgroundColor = "";
    };
  } ,[]);

  return (
    <div className={styles.page}>
      <Header />
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
