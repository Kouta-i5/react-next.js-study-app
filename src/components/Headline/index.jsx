'use client';

import { useEffect,useCallback } from "react";
import styles from "./Headline.module.css";

  // const handleClick = (e,a) =>{
  //   console.log(e.target.className)
  //   alert(a)
  // } 

export function Headline(props) {
  //関数は基本的には内部に定義した方がいい。しかし、
  const a = 1;

  function foo (e) {
    alert ("fooという関数をreturnの外で定義しましたよ")
  };

  const handleClick = useCallback((e) => {
    console.log(e.target.className)
    alert(a)
  },[])
// const 関数名 = useCallBack(() => {
//      処理
// },第二引数);

  useEffect(() => {
    console.log('マウントされました');

    return () => {
      console.log('アンマウントされました');
    };
  }, []);


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
      <button 
        className={styles.button }
        onClick={()=> alert("123")}
      >
        ボタン2
      </button>
      <button
        className={styles.button }
        onClick={()=>{alert("!") }} 
      >
      アロー関数表記の無名関数
      </button>
      <button
        className={styles.button }
        onClick={function  () {
          alert ("!")
        }
      } 
      >
      通常関数
      </button>
      <button
        className={styles.button }
        onClick={foo
      } 
      >
      通常関数でreturnの外で関数を定義
      </button>
      <button
        className={styles.button}
        onClick = {function (event) {
          // event.preventDefault();
          console.log(event.target.className)//出力としてはclassNameの属性がわかる。Headline_button__g9bmA
          // alert(123456)
        }}
      >
      こんにちわ
      </button>
      <button
        className={styles.button }
        onClick={(e)=>{
          handleClick(e,a)
        }
      } 
      >
      aを渡してみた。
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
