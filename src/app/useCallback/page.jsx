'use client';
import styles from "@/app/useCallback/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState, useCallback, useMemo } from 'react';

export default function UseCallbackPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([
    { id: 1, text: 'Reactを学ぶ', completed: false },
    { id: 2, text: 'useCallbackを理解する', completed: false },
    { id: 3, text: 'パフォーマンスを最適化する', completed: false }
  ]);

  // 1. 基本的なuseCallback（依存配列なし）
  const handleClick = useCallback(() => {
    console.log('ボタンがクリックされました');
    alert('useCallbackが動作しています！');
  }, []); // 空の依存配列 = 関数は再作成されない

  // 2. 依存配列ありのuseCallback
  const handleCountIncrement = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // countに依存していないので空配列

  const handleCountReset = useCallback(() => {
    setCount(0);
  }, []); // 依存する値がないので空配列

  // 3. 依存配列ありのuseCallback
  const handleTextChange = useCallback((newText) => {
    setText(newText);
  }, []); // 依存する値がないので空配列

  const handleAddTodo = useCallback(() => {
    if (text.trim()) {
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setText('');
    }
  }, [text]); // textが変更されたときにのみ関数を再作成

  // 4. 複雑な依存関係のuseCallback
  const handleToggleTodo = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // todosに依存していないので空配列

  const handleDeleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // todosに依存していないので空配列

  // 5. オブジェクトを返すuseCallback
  const getTodoStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [todos]); // todosが変更されたときにのみ関数を再作成

  // 6. イベントハンドラーを返すuseCallback
  const createTodoHandler = useCallback((action) => {
    return () => {
      switch (action) {
        case 'complete':
          setTodos(prevTodos => 
            prevTodos.map(todo => ({ ...todo, completed: true }))
          );
          break;
        case 'clear':
          setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
          break;
        case 'shuffle':
          setTodos(prevTodos => [...prevTodos].sort(() => Math.random() - 0.5));
          break;
        default:
          break;
      }
    };
  }, []); // 依存する値がないので空配列

  // 7. パフォーマンス比較用の関数（useCallbackなし）
  const handleClickWithoutCallback = () => {
    console.log('useCallbackなしの関数が実行されました');
    alert('この関数は毎回再作成されています');
  };

  // 8. useMemoとの組み合わせ
  const todoStats = useMemo(() => getTodoStats(), [getTodoStats]);

  // 9. カスタムフック風のuseCallback
  const useCounter = useCallback(() => {
    return {
      increment: () => setCount(prev => prev + 1),
      decrement: () => setCount(prev => prev - 1),
      reset: () => setCount(0),
      double: () => setCount(prev => prev * 2)
    };
  }, []);

  const counterActions = useCounter();

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>useCallback 学習ページ</h1>
        
        {/* 基本的なuseCallback */}
        <section className={styles.section}>
          <h2>1. 基本的なuseCallback（依存配列なし）</h2>
          <p>現在のカウント: <strong>{count}</strong></p>
          <div className={styles.buttonGroup}>
            <button onClick={handleClick} className={styles.button}>
              useCallbackボタン
            </button>
            <button onClick={handleClickWithoutCallback} className={styles.button}>
              useCallbackなしボタン
            </button>
          </div>
          <p className={styles.explanation}>
            空の依存配列[]を使用することで、関数は再作成されません。パフォーマンスの最適化に役立ちます。
          </p>
        </section>

        {/* カウンター操作 */}
        <section className={styles.section}>
          <h2>2. カウンター操作のuseCallback</h2>
          <div className={styles.buttonGroup}>
            <button onClick={handleCountIncrement} className={styles.button}>
              カウント増加
            </button>
            <button onClick={handleCountReset} className={styles.button}>
              リセット
            </button>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={counterActions.increment} className={styles.button}>
              +1 (カスタムフック風)
            </button>
            <button onClick={counterActions.decrement} className={styles.button}>
              -1 (カスタムフック風)
            </button>
            <button onClick={counterActions.double} className={styles.button}>
              2倍 (カスタムフック風)
            </button>
          </div>
          <p className={styles.explanation}>
            カウンター操作の関数はuseCallbackで最適化されており、不要な再レンダリングを防ぎます。
          </p>
        </section>

        {/* Todo管理 */}
        <section className={styles.section}>
          <h2>3. Todo管理のuseCallback</h2>
          <div className={styles.todoInput}>
            <input
              type="text"
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="新しいタスクを入力"
              className={styles.input}
            />
            <button onClick={handleAddTodo} className={styles.button}>追加</button>
          </div>
          
          <div className={styles.todoActions}>
            <button onClick={createTodoHandler('complete')} className={styles.button}>
              全て完了にする
            </button>
            <button onClick={createTodoHandler('clear')} className={styles.button}>
              完了済みを削除
            </button>
            <button onClick={createTodoHandler('shuffle')} className={styles.button}>
              順序をシャッフル
            </button>
          </div>
          
          <ul className={styles.todoList}>
            {todos.map(todo => (
              <li key={todo.id} className={styles.todoItem}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <span className={todo.completed ? styles.completed : ''}>
                  {todo.text}
                </span>
                <button 
                  onClick={() => handleDeleteTodo(todo.id)}
                  className={styles.deleteButton}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 統計情報 */}
        <section className={styles.section}>
          <h2>4. 統計情報の表示</h2>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h3>総タスク数</h3>
              <p className={styles.statValue}>{todoStats.total}</p>
            </div>
            <div className={styles.statItem}>
              <h3>完了済み</h3>
              <p className={styles.statValue}>{todoStats.completed}</p>
            </div>
            <div className={styles.statItem}>
              <h3>未完了</h3>
              <p className={styles.statValue}>{todoStats.pending}</p>
            </div>
            <div className={styles.statItem}>
              <h3>完了率</h3>
              <p className={styles.statValue}>{todoStats.completionRate}%</p>
            </div>
          </div>
          <p className={styles.explanation}>
            統計情報はuseMemoとuseCallbackを組み合わせて最適化されています。
          </p>
        </section>

        {/* パフォーマンス比較 */}
        <section className={styles.section}>
          <h2>5. パフォーマンス比較</h2>
          <div className={styles.performanceInfo}>
            <h3>useCallbackの利点:</h3>
            <ul>
              <li>関数の再作成を防ぐ</li>
              <li>子コンポーネントの不要な再レンダリングを防ぐ</li>
              <li>メモ化された値との一貫性を保つ</li>
              <li>依存関係が明確になる</li>
            </ul>
            
            <h3>使用すべき場面:</h3>
            <ul>
              <li>子コンポーネントにpropsとして渡す関数</li>
              <li>useEffectの依存配列に含める関数</li>
              <li>useMemoの依存配列に含める関数</li>
              <li>高価な計算を行う関数</li>
            </ul>
          </div>
        </section>

        {/* useCallbackの説明 */}
        <section className={styles.section}>
          <h2>useCallback の基本概念</h2>
          <div className={styles.concept}>
            <h3>構文</h3>
            <code className={styles.code}>
              const memoizedCallback = useCallback(() => { /* 関数の内容 */ }, [依存配列]);
            </code>
            
            <h3>パラメータ</h3>
            <ul>
              <li><strong>関数</strong>: メモ化したい関数</li>
              <li><strong>依存配列</strong>: 関数が再作成される条件</li>
            </ul>
            
            <h3>戻り値</h3>
            <ul>
              <li><strong>memoizedCallback</strong>: メモ化された関数</li>
            </ul>
            
            <h3>依存配列のパターン</h3>
            <ul>
              <li><strong>[]</strong>: 関数は再作成されない（マウント時のみ作成）</li>
              <li><strong>[value]</strong>: 指定した値が変更されたときにのみ関数を再作成</li>
              <li><strong>なし</strong>: 毎回のレンダリングで関数を再作成（非推奨）</li>
            </ul>
            
            <h3>重要なポイント</h3>
            <ul>
              <li>関数の参照の同一性を保つことでパフォーマンスを最適化</li>
              <li>依存配列を適切に設定することが重要</li>
              <li>過度な最適化は避ける（必要以上に使わない）</li>
              <li>useMemoと組み合わせて使用することが多い</li>
              <li>子コンポーネントのReact.memoと組み合わせると効果的</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
