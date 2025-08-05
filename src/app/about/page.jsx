'use client';

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import { Link } from "@/components/Link";
import styles from "@/styles/page.module.css";
import {useEffect} from "react"

export default function About() {
  const handleClick = () => {
    alert("aboutページでボタンが押されました。");
    console.kg("aboutページでボタンが押されました。")
  };

  // useEffect (() => {
  //     document.body.style.backgroundColor = "lightgreen";
  // } ,[]);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Headline title="About" click={handleClick}>
          <code className={styles.code}>about/page.jsだよ</code>
        </Headline>
        <Link />
      </main>
      <Footer />
    </div>
  );
}
