import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            {/* ボタンスタイルのナビゲーションリンク */}
            <Link href="/" className={`${styles.navButton} ${styles.homeButton}`}>
                🏠 Home
            </Link>
            <Link href="/about" className={`${styles.navButton} ${styles.aboutButton}`}>
                ℹ️ About
            </Link>
            <Link href="/useState" className={`${styles.navButton} ${styles.useStateButton}`}>
                📊 useState
            </Link>
            <Link href="/useEffect" className={`${styles.navButton} ${styles.useEffectButton}`}>
                ⚡ useEffect
            </Link>
            <Link href="/useCallback" className={`${styles.navButton} ${styles.useCallbackButton}`}>
                🔄 useCallback
            </Link>
        </header>
    )
}
