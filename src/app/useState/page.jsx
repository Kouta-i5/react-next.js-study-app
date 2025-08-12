'use client';
import styles from "@/app/useState/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState } from 'react';


//const [変数名, 設定関数] = useState(初期値);
//const 関数名 = (引数) => 設定関数（）；
//const 関数名 = () => 設定関数（prevCount => prevCount + 1）；

export default function UseStatePage() {
  // 基本的なカウンター
  const [count, setCount] = useState(0);
  // カウンターの関数（関数型更新を使用）
  //prevCount => prevCount + 1の書き方はアロー関数のreturnと波括弧省略記法の記述
  const increment = () => setCount(prevCount => prevCount + 1);
  // 下記の書き方は省略せずに書いたもの
  // const increment = () => setCount(function(prevCount) {
  //   return prevCount + 1;
  // });
  const decrement = () => setCount(prevCount => prevCount - 1);
  const reset = () => setCount(0);
  
  
  // 文字列の状態管理
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('こんにちは！');

  // 名前入力の処理
  //eというのはイベントオブジェクト、引数としてあるイベントが渡されるからそう命名された
  //e.targetはイベントが発生した要素(HTML要素)を参照するためのもの
  //e.target.valueはinputのvalueを取得するためのもの
  //inputのonChangeイベントは、inputのvalueが変更されたときに発生するイベント
  //setName(e.target.value)は、inputのvalueをnameに設定するためのもの
  //setGreeting(`こんにちは、${e.target.value}さん！`)は、inputのvalueをgreetingに設定するためのもの
  //そして、greetingがpタグの中に表示される
  const handleNameChange = (e) => {
    console.log(e);
    console.log(e.target);
    console.log(e.target.value);
    setName(e.target.value);
    setGreeting(`こんにちは、${e.target.value}さん！`);
  };


  // 真偽値の状態管理
  const [isVisible, setIsVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 配列の状態管理
  const [todos, setTodos] = useState([
    { id: 1, text: 'Reactを学ぶ', completed: false },
    { id: 2, text: 'useStateを理解する', completed: false },
    { id: 3, text: 'プロジェクトを作る', completed: false }
  ]);
  // 新しいTodoを入力するための状態
  const [newTodo, setNewTodo] = useState('');

  // Todoの追加
  //.trim()は文字列の両端の空白を削除するメソッド(標準組み込みオブジェクト)
  const addTodo = () => {
    if (newTodo.trim()) {
      // 空文字列でない場合のみ処理を実行
      //Date.now()は現在の日時をミリ秒で取得するメソッド(標準組み込みオブジェクト)
      const newTodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false
      };
      // ...todosは現在のtodos配列を展開して新しい配列を作成するためのもの
      // newTodoItemは新しいTodoアイテムのオブジェクト
      // setTodos([...todos, newTodoItem])は新しいTodoアイテムを追加した新しい配列をsetTodosに設定するためのもの
      // newTodoItemを追加した新しい配列を作成するために、現在のtodos配列を展開して新しい配列を作成している
      setTodos([...todos, newTodoItem]);
      // 新しいTodoアイテムを追加した後、newTodoを空文字列に設定するためのもの
      setNewTodo('');
    }
  };
  
  // Todoの完了状態を切り替え
  //todos.mapで配列を変えたものをtodoに設定する。
  //x => yはxをyに変換するためのもの
  // todos.map((todo) => {
  //   if (todo.id === id) {
  //     return { ...todo, completed: !todo.completed };
  //   } else {
  //     return todo; // ← これが「: todo」に相当
  //   }
  // });
  const toggleTodo = (id) => {
    setTodos(todos.map(prevTodo => 
      prevTodo.id === id //条件式
      ? { ...prevTodo, completed: !prevTodo.completed } //条件式がtrueの場合
      : prevTodo //条件式がfalseの場合
    ));
  };
  
  // Todoの削除
  const deleteTodo = (id) => {
    setTodos(todos.filter(prevTodo => prevTodo.id !== id));
  };
  
  
  // オブジェクトの状態管理
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });


  // ユーザー情報の更新
  const updateUser = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>useState 学習ページ</h1>
        
        {/* 基本的なカウンター */}
        <section className={styles.section}>
          <h2>1. 基本的なカウンター</h2>
          <p>現在のカウント: <strong>{count}</strong></p>
          <div className={styles.buttonGroup}>
            <button onClick={increment} className={styles.button}>+1</button>
            <button onClick={decrement} className={styles.button}>-1</button>
            <button onClick={reset} className={styles.button}>リセット</button>
          </div>
          <p className={styles.explanation}>
            useState(0)で初期値0の状態を作成し、setCountで値を更新しています。
          </p>
        </section>

        {/* 文字列の状態管理 */}
        <section className={styles.section}>
          <h2>2. 文字列の状態管理</h2>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="名前を入力してください"
            className={styles.input}
          />
          <p className={styles.greeting}>{greeting}</p>
          <p className={styles.explanation}>
            入力値に応じて動的に挨拶メッセージが更新されます。
          </p>
        </section>

        {/* 真偽値の状態管理 */}
        <section className={styles.section}>
          <h2>3. 真偽値の状態管理</h2>
          <div className={styles.buttonGroup}>
            <button 
              //isVisibleの値を反転させる
              onClick={() => setIsVisible(!isVisible)} 
              className={styles.button}
            >
              {/* 三項演算子を使用して、isVisibleの値によってボタンの表示を切り替える */}
              {isVisible ? '非表示にする' : '表示する'}
            </button>
            {/* isDarkModeの値を反転させる */}
            {/* 三項演算子を使用して、isDarkModeの値によってclassNameを動的に変更する */}
            {/* isDarkModeの値によってボタンの表示を切り替える */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`${styles.button} ${isDarkMode ? styles.darkButton : ''}`}
              >
              {isDarkMode ? 'ライトモード' : 'ダークモード'}
            </button>
          </div>
          {isVisible && (
            <p className={styles.message}>
              このメッセージは表示/非表示を切り替えできます！
            </p>
          )}
        </section>

        {/* 配列の状態管理 */}
        <section className={styles.section}>
          <h2>4. 配列の状態管理（Todoリスト）</h2>
          <div className={styles.todoInput}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="新しいタスクを入力"
              className={styles.input}
            />
            <button onClick={addTodo} className={styles.button}>追加</button>
          </div>
          <ul className={styles.todoList}>
            {todos.map(todo => (
              <li key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? styles.completed : ''}>
                  {todo.text}
                </span>
                <button 
                  onClick={() => deleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* オブジェクトの状態管理 */}
        <section className={styles.section}>
          <h2>5. オブジェクトの状態管理</h2>
          <div className={styles.form}>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser('name', e.target.value)}
              placeholder="名前"
              className={styles.input}
            />
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUser('email', e.target.value)}
              placeholder="メールアドレス"
              className={styles.input}
            />
            <input
              type="number"
              value={user.age}
              onChange={(e) => updateUser('age', parseInt(e.target.value) || 0)}
              placeholder="年齢"
              className={styles.input}
            />
          </div>
          <div className={styles.userInfo}>
            <h3>ユーザー情報:</h3>
            <p>名前: {user.name || '未入力'}</p>
            <p>メール: {user.email || '未入力'}</p>
            <p>年齢: {user.age || '未入力'}</p>
          </div>
        </section>

        {/* useStateの説明 */}
        <section className={styles.section}>
          <h2>useState の基本概念</h2>
          <div className={styles.concept}>
            <h3>構文</h3>
            <code className={styles.code}>
              const [state, setState] = useState(initialValue);
            </code>
            
            <h3>パラメータ</h3>
            <ul>
              <li><strong>initialValue</strong>: 状態の初期値</li>
            </ul>
            
            <h3>戻り値</h3>
            <ul>
              <li><strong>state</strong>: 現在の状態値</li>
              <li><strong>setState</strong>: 状態を更新する関数</li>
            </ul>
            
            <h3>重要なポイント</h3>
            <ul>
              <li>状態の更新は非同期で行われる</li>
              <li>オブジェクトや配列を更新する際は、新しいオブジェクト/配列を作成する</li>
              <li>useStateはコンポーネントの再レンダリングを引き起こす</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
