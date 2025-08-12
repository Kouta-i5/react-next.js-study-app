'use client';
import styles from "@/app/useContext/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { createContext, useContext, useEffect, useState } from 'react';

// 1. 基本的なコンテキスト
const ThemeContext = createContext();
const UserContext = createContext();

// 2. 複雑なコンテキスト
const AppContext = createContext();

// カスタムフック: テーマの切り替え
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// カスタムフック: ユーザー情報の管理
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// カスタムフック: アプリ全体の状態管理
function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// テーマプロバイダーコンポーネント
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#007bff');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
  };

  const value = {
    theme,
    accentColor,
    toggleTheme,
    changeAccentColor,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ユーザープロバイダーコンポーネント
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // ローカルストレージからユーザー情報を復元
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('ユーザー情報の復元に失敗しました:', error);
      }
    }
  }, []);

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// アプリ全体のプロバイダーコンポーネント
function AppProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [...prev, notification]);
    
    // 5秒後に自動削除
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const value = {
    notifications,
    sidebarOpen,
    addNotification,
    removeNotification,
    toggleSidebar
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// テーマ表示コンポーネント
function ThemeDisplay() {
  const { theme, accentColor, toggleTheme, changeAccentColor } = useTheme();

  return (
    <div className={styles.themeSection}>
      <h3>現在のテーマ: {theme}</h3>
      <div className={styles.colorPreview} style={{ backgroundColor: accentColor }}>
        アクセントカラー
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={toggleTheme} className={styles.button}>
          テーマ切り替え
        </button>
        <button 
          onClick={() => changeAccentColor('#ff6b6b')} 
          className={styles.button}
          style={{ backgroundColor: '#ff6b6b' }}
        >
          赤色
        </button>
        <button 
          onClick={() => changeAccentColor('#4ecdc4')} 
          className={styles.button}
          style={{ backgroundColor: '#4ecdc4' }}
        >
          青色
        </button>
        <button 
          onClick={() => changeAccentColor('#45b7d1')} 
          className={styles.button}
          style={{ backgroundColor: '#45b7d1' }}
        >
          緑色
        </button>
      </div>
    </div>
  );
}

// ユーザー情報表示コンポーネント
function UserDisplay() {
  const { user, isLoggedIn, login, logout, updateProfile } = useUser();
  const [loginForm, setLoginForm] = useState({ username: '', email: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username && loginForm.email) {
      login({
        id: Date.now(),
        username: loginForm.username,
        email: loginForm.email,
        joinDate: new Date()
      });
      setLoginForm({ username: '', email: '' });
    }
  };

  const handleUpdateProfile = () => {
    const newUsername = prompt('新しいユーザー名を入力してください:', user.username);
    if (newUsername) {
      updateProfile({ username: newUsername });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.userSection}>
        <h3>ログインしてください</h3>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="text"
            placeholder="ユーザー名"
            value={loginForm.username}
            onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="メールアドレス"
            value={loginForm.email}
            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>ログイン</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.userSection}>
      <h3>ユーザー情報</h3>
      <div className={styles.userInfo}>
        <p><strong>ユーザー名:</strong> {user.username}</p>
        <p><strong>メール:</strong> {user.email}</p>
        <p><strong>登録日:</strong> {user.joinDate.toLocaleDateString()}</p>
      </div>
      <div className={styles.buttonGroup}>
        <button onClick={handleUpdateProfile} className={styles.button}>
          プロフィール更新
        </button>
        <button onClick={logout} className={styles.button}>
          ログアウト
        </button>
      </div>
    </div>
  );
}

// 通知表示コンポーネント
function NotificationDisplay() {
  const { notifications, addNotification, removeNotification } = useApp();

  return (
    <div className={styles.notificationSection}>
      <h3>通知システム</h3>
      <div className={styles.buttonGroup}>
        <button 
          onClick={() => addNotification('情報メッセージです', 'info')} 
          className={styles.button}
        >
          情報通知
        </button>
        <button 
          onClick={() => addNotification('成功しました！', 'success')} 
          className={styles.button}
        >
          成功通知
        </button>
        <button 
          onClick={() => addNotification('警告メッセージです', 'warning')} 
          className={styles.button}
        >
          警告通知
        </button>
        <button 
          onClick={() => addNotification('エラーが発生しました', 'error')} 
          className={styles.button}
        >
          エラー通知
        </button>
      </div>
      
      <div className={styles.notificationList}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`${styles.notification} ${styles[notification.type]}`}
          >
            <span>{notification.message}</span>
            <button 
              onClick={() => removeNotification(notification.id)}
              className={styles.closeButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// サイドバーコンポーネント
function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useApp();

  return (
    <>
      <button onClick={toggleSidebar} className={styles.sidebarToggle}>
        {sidebarOpen ? '×' : '☰'}
      </button>
      
      {sidebarOpen && (
        <div className={styles.sidebar}>
          <h3>サイドバー</h3>
          <ul>
            <li>ホーム</li>
            <li>プロフィール</li>
            <li>設定</li>
            <li>ヘルプ</li>
          </ul>
        </div>
      )}
    </>
  );
}

// メインコンポーネント
export default function UseContextPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>useContext 学習ページ</h1>
        
        <p className={styles.description}>
          useContextは、Reactコンポーネントツリー全体でデータを共有するためのフックです。
          プロップドリリングを避け、グローバルな状態管理を簡単に実現できます。
        </p>

        {/* プロバイダーでコンポーネントをラップ */}
        <AppProvider>
          <UserProvider>
            <ThemeProvider>
              <div className={styles.content}>
                {/* 基本的なuseContextの例 */}
                <section className={styles.section}>
                  <h2>1. 基本的なuseContextの使用</h2>
                  <p className={styles.explanation}>
                    テーマコンテキストを使用して、アプリ全体でテーマ情報を共有します。
                  </p>
                  <ThemeDisplay />
                </section>

                {/* ユーザー情報の管理 */}
                <section className={styles.section}>
                  <h2>2. ユーザー情報の管理</h2>
                  <p className={styles.explanation}>
                    ユーザーコンテキストを使用して、ログイン状態とユーザー情報を管理します。
                  </p>
                  <UserDisplay />
                </section>

                {/* アプリ全体の状態管理 */}
                <section className={styles.section}>
                  <h2>3. アプリ全体の状態管理</h2>
                  <p className={styles.explanation}>
                    通知システムとサイドバーの状態を管理します。
                  </p>
                  <NotificationDisplay />
                  <Sidebar />
                </section>

                {/* useContextの説明 */}
                <section className={styles.section}>
                  <h2>useContext の基本概念</h2>
                  <div className={styles.concept}>
                    <h3>構文</h3>
                    <code className={styles.code}>
                      const value = useContext(MyContext);
                    </code>
                    
                    <h3>基本的な流れ</h3>
                    <ol>
                      <li>createContext()でコンテキストを作成</li>
                      <li>Providerコンポーネントで値を提供</li>
                      <li>useContext()で値を消費</li>
                    </ol>
                    
                    <h3>メリット</h3>
                    <ul>
                      <li>プロップドリリングを避けられる</li>
                      <li>コンポーネント間の結合度を下げる</li>
                      <li>グローバルな状態管理が簡単</li>
                      <li>コードの可読性が向上</li>
                    </ul>
                    
                    <h3>注意点</h3>
                    <ul>
                      <li>コンテキストの値が変更されると、そのコンテキストを使用するすべてのコンポーネントが再レンダリングされる</li>
                      <li>小さなアプリでは過剰な可能性がある</li>
                      <li>パフォーマンスを考慮した設計が必要</li>
                    </ul>
                  </div>
                </section>
              </div>
            </ThemeProvider>
          </UserProvider>
        </AppProvider>
      </main>
      <Footer />
    </div>
  );
}
