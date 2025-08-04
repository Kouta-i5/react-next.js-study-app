'use client';

import styles from './Link.module.css';

const ITEMS = [
  {
    id: 1,
    name: 'Next.js公式サイト',
    url: 'https://nextjs.org',
  },
  {
    id: 2,
    name: 'React公式サイト',
    url: 'https://react.dev',
  },
  {
    id: 3,
    name: 'GitHub',
    url: 'https://github.com',
  }
]

export function Link() {
  const handleLinkClick = (linkName) => {
    alert(`${linkName}がクリックされました！`);
  };

  return (
    <main className={styles.linkContainer}>
      <h1 className={styles.title}>リンクとナビゲーション</h1>
      
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>外部リンク</h2>
        <div className={styles.linkGrid}>
          {/* ハードコーディングされたリンク（参考用） */}
          {/* 
          <a 
            href="https://nextjs.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.externalLink}
            onClick={() => handleLinkClick('Next.js公式サイト')}
          >
             Next.js公式サイト
          </a>
          
          <a 
            href="https://react.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.externalLink}
            onClick={() => handleLinkClick('React公式サイト')}
          >
             React公式サイト
          </a>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.externalLink}
            onClick={() => handleLinkClick('GitHub')}
          >
             GitHub
          </a>
          */}

          {/* map()メソッドを使用した動的なリンク生成 */}
          {ITEMS.map((item) => {
            return(
              <a 
                key={item.id}
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.externalLink}
                onClick={() => handleLinkClick(item.name)}
              >
                {item.name === 'Next.js公式サイト' && '🌐 '}
                {item.name === 'React公式サイト' && '⚛️ '}
                {item.name === 'GitHub' && '📚 '}
                {item.id}_{item.name}
                {item.url}
              </a>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>内部ナビゲーション</h2>
        <nav className={styles.navigation}>
          <button 
            className={styles.navButton}
            onClick={() => handleLinkClick('ホーム')}
          >
            🏠 ホーム
          </button>
          
          <button 
            className={styles.navButton}
            onClick={() => handleLinkClick('プロフィール')}
          >
            👤 プロフィール
          </button>
          
          <button 
            className={styles.navButton}
            onClick={() => handleLinkClick('設定')}
          >
            ⚙️ 設定
          </button>
          
          <button 
            className={styles.navButton}
            onClick={() => handleLinkClick('ヘルプ')}
          >
            ❓ ヘルプ
          </button>
        </nav>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>学習リソース</h2>
        <div className={styles.resourceList}>
          <div className={styles.resourceItem}>
            <h3 className={styles.resourceTitle}>📖 CSS Modules</h3>
            <p className={styles.resourceDescription}>
              CSS Modulesを使用してコンポーネント固有のスタイルを管理する方法を学びます。
            </p>
            <button 
              className={styles.learnButton}
              onClick={() => handleLinkClick('CSS Modules学習')}
            >
              学習を開始
            </button>
          </div>
          
          <div className={styles.resourceItem}>
            <h3 className={styles.resourceTitle}>🎨 CSS-in-JS</h3>
            <p className={styles.resourceDescription}>
              JavaScript内でCSSを記述し、動的なスタイルを実装する方法を学びます。
            </p>
            <button 
              className={styles.learnButton}
              onClick={() => handleLinkClick('CSS-in-JS学習')}
            >
              学習を開始
            </button>
          </div>
          
          <div className={styles.resourceItem}>
            <h3 className={styles.resourceTitle}>⚡ Next.js App Router</h3>
            <p className={styles.resourceDescription}>
              Next.js 13+のApp Routerを使用した最新のルーティング方法を学びます。
            </p>
            <button 
              className={styles.learnButton}
              onClick={() => handleLinkClick('App Router学習')}
            >
              学習を開始
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          💡 ヒント: 各リンクをクリックすると、どのリンクがクリックされたかが表示されます。
        </p>
      </footer>
    </main>
  );
}
