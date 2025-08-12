'use client';
import styles from "@/app/useEffect/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useEffect, useState } from 'react';

export default function UseEffectPage() {
  // 基本的なuseEffect（マウント時のみ実行）
  const [count, setCount] = useState(0);
  const [title, setTitle] = useState('useEffect学習ページ');

  // 1. マウント時のみ実行されるuseEffect
  useEffect(() => {
    console.log('コンポーネントがマウントされました');
    document.title = title;
    
    // クリーンアップ関数（アンマウント時に実行）
    return () => {
      console.log('コンポーネントがアンマウントされました');
      document.title = 'React Next.js Study App';
    };
  }, []); // 空の依存配列 = マウント時のみ実行

  // 2. 特定の値が変更されたときに実行されるuseEffect
  useEffect(() => {
    console.log(`カウントが変更されました: ${count}`);
    document.title = `${title} - カウント: ${count}`;
  }, [count, title]); // countまたはtitleが変更されたときに実行

  // 3. タイマーを使用したuseEffect
  const [time, setTime] = useState(new Date());
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let intervalId;
    
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setTime(new Date());
      }, 1000);
    }

    // クリーンアップ関数でタイマーを停止
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTimerActive]); // isTimerActiveが変更されたときに実行

  // 4. API呼び出しをシミュレートしたuseEffect
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 実際のAPIの代わりにsetTimeoutでシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
        { id: 2, name: '佐藤花子', email: 'sato@example.com' },
        { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' }
      ];
      
      setUsers(mockUsers);
    } catch (err) {
      setError('ユーザー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // マウント時に一度だけ実行

  // 5. ウィンドウサイズの監視
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // マウント時に一度だけ実行

  // 6. ローカルストレージとの同期
  const [theme, setTheme] = useState('light');
  const [savedData, setSavedData] = useState('');

  // テーマの保存と復元
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  // データの保存
  const saveData = () => {
    localStorage.setItem('userData', savedData);
    alert('データが保存されました！');
  };

  const loadData = () => {
    const data = localStorage.getItem('userData');
    if (data) {
      setSavedData(data);
    }
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>useEffect 学習ページ</h1>
        
        {/* 基本的なuseEffect */}
        <section className={styles.section}>
          <h2>1. 基本的なuseEffect（マウント時のみ）</h2>
          <p>現在のカウント: <strong>{count}</strong></p>
          <div className={styles.buttonGroup}>
            <button onClick={() => setCount(c => c + 1)} className={styles.button}>
              カウント増加
            </button>
            <button onClick={() => setTitle('新しいタイトル')} className={styles.button}>
              タイトル変更
            </button>
          </div>
          <p className={styles.explanation}>
            空の依存配列[]を使用することで、コンポーネントのマウント時のみ実行されます。
          </p>
        </section>

        {/* タイマーを使用したuseEffect */}
        <section className={styles.section}>
          <h2>2. タイマーを使用したuseEffect</h2>
          <p className={styles.timeDisplay}>
            現在時刻: <strong>{time.toLocaleTimeString()}</strong>
          </p>
          <div className={styles.buttonGroup}>
            <button 
              onClick={() => setIsTimerActive(!isTimerActive)} 
              className={`${styles.button} ${isTimerActive ? styles.activeButton : ''}`}
            >
              {isTimerActive ? 'タイマー停止' : 'タイマー開始'}
            </button>
          </div>
          <p className={styles.explanation}>
            タイマーがアクティブな間は1秒ごとに時刻が更新されます。クリーンアップ関数でタイマーを適切に停止します。
          </p>
        </section>

        {/* API呼び出しをシミュレートしたuseEffect */}
        <section className={styles.section}>
          <h2>3. データ取得のuseEffect</h2>
          <div className={styles.buttonGroup}>
            <button onClick={fetchUsers} className={styles.button}>
              ユーザー再取得
            </button>
          </div>
          
          {loading && <p className={styles.loading}>読み込み中...</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          {users.length > 0 && (
            <div className={styles.userList}>
              <h3>ユーザー一覧:</h3>
              {users.map(user => (
                <div key={user.id} className={styles.userItem}>
                  <strong>{user.name}</strong> - {user.email}
                </div>
              ))}
            </div>
          )}
          
          <p className={styles.explanation}>
            コンポーネントのマウント時に自動的にユーザー情報を取得します。
          </p>
        </section>

        {/* ウィンドウサイズの監視 */}
        <section className={styles.section}>
          <h2>4. ウィンドウサイズの監視</h2>
          <div className={styles.windowInfo}>
            <p>ウィンドウ幅: <strong>{windowSize.width}px</strong></p>
            <p>ウィンドウ高さ: <strong>{windowSize.height}px</strong></p>
          </div>
          <p className={styles.explanation}>
            ウィンドウのリサイズイベントを監視し、サイズが変更されるたびに状態を更新します。
          </p>
        </section>

        {/* ローカルストレージとの同期 */}
        <section className={styles.section}>
          <h2>5. ローカルストレージとの同期</h2>
          <div className={styles.themeSelector}>
            <label>テーマ選択: </label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className={styles.select}
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>
          
          <div className={styles.dataStorage}>
            <input
              type="text"
              value={savedData}
              onChange={(e) => setSavedData(e.target.value)}
              placeholder="保存したいデータを入力"
              className={styles.input}
            />
            <div className={styles.buttonGroup}>
              <button onClick={saveData} className={styles.button}>保存</button>
              <button onClick={loadData} className={styles.button}>読み込み</button>
            </div>
          </div>
          
          <p className={styles.explanation}>
            テーマの選択は自動的にローカルストレージに保存され、ページをリロードしても維持されます。
          </p>
        </section>

        {/* useEffectの説明 */}
        <section className={styles.section}>
          <h2>useEffect の基本概念</h2>
          <div className={styles.concept}>
            <h3>構文</h3>
            <code className={styles.code}>
              useEffect(() =&gt; { /* 実行したい処理 */ }, [依存配列]);
            </code>
            
            <h3>依存配列のパターン</h3>
            <ul>
              <li><strong>[]</strong>: マウント時のみ実行（空の依存配列）</li>
              <li><strong>[value]</strong>: 特定の値が変更されたときに実行</li>
              <li><strong>なし</strong>: 毎回のレンダリングで実行（非推奨）</li>
            </ul>
            
            <h3>クリーンアップ関数</h3>
            <ul>
              <li>useEffectの戻り値として関数を返すことで、クリーンアップを実行</li>
              <li>アンマウント時や依存配列の値が変更される前に実行される</li>
              <li>イベントリスナーの削除やタイマーの停止に使用</li>
            </ul>
            
            <h3>重要なポイント</h3>
            <ul>
              <li>副作用（API呼び出し、タイマー、イベントリスナーなど）を扱う</li>
              <li>依存配列を適切に設定することで、不要な再実行を防ぐ</li>
              <li>クリーンアップ関数でリソースの解放を忘れずに行う</li>
              <li>無限ループに注意する（依存配列の設定が重要）</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
