'use client';

import styles from "./Headline.module.css";

export function Headline(props) {

  return (
    // <></>か<React.Fragment></React.Fragment>を使うこともある。
    <div className={styles.headline}>
      <h1 className={styles.title}>{props.title}</h1>

      <p className={styles.description}>
        Get started by editing {props.children}
      </p>
      <button 
        className={styles.button}
        onClick={props.click}
      >
        ボタン
      </button>
    </div>
  );
}

// これは、propsを使わない場合のコードです。
// export function Headline() {
// <div>
//   <h1 className={styles.title}>Home</h1>
//   <p className={styles.description}>
//     Get started by editing {''}
//     <code className={styles.code}>pages.js</code>
//   </p>
// </div>
