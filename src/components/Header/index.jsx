import Link from 'next/link';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            {/* <a href="/">Home</a>
            <a href="/about">About</a> */}
            {/* aタグはページの遷移が遅い。Linkはページの遷移が早い。 */}
            {/* Linkはaタグをラップしている。さらに、prefetchを自動で行ってくれる。LinkはNext.jsで提供されているコンポーネント */}
            <div className={styles.headerHome}>
                <Link href="/">Home</Link>
            </div>
            <div className={styles.headerAbout}>
                <Link href="/about">About</Link>
            </div>
        </header>
    )
}
