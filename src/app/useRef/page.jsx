'use client';
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from "./page.module.css";

// フォーカス管理のカスタムフック
function useFocus() {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const focusButton = useCallback(() => {
    buttonRef.current?.focus();
  }, []);

  const blurInput = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  return {
    inputRef,
    buttonRef,
    focusInput,
    focusButton,
    blurInput
  };
}

// スクロール位置管理のカスタムフック
function useScrollPosition() {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({ 
        top: scrollHeight - clientHeight, 
        behavior: 'smooth' 
      });
    }
  }, []);

  const scrollToElement = useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollPosition(scrollRef.current.scrollTop);
      }
    };

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return {
    scrollRef,
    scrollPosition,
    scrollToTop,
    scrollToBottom,
    scrollToElement
  };
}

// 前の値の追跡
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// カウンターの前の値と現在の値を比較
function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div className={styles.demoSection}>
      <h3>前の値の追跡</h3>
      <div className={styles.counterDisplay}>
        <p>現在の値: {count}</p>
        <p>前の値: {previousCount !== undefined ? previousCount : 'なし'}</p>
        <p>変化: {previousCount !== undefined ? count - previousCount : 0}</p>
        <div className={styles.buttonGroup}>
          <button onClick={() => setCount(c => c + 1)} className={styles.button}>
            増加
          </button>
          <button onClick={() => setCount(c => c - 1)} className={styles.button}>
            減少
          </button>
          <button onClick={() => setCount(0)} className={styles.button}>
            リセット
          </button>
        </div>
      </div>
    </div>
  );
}

// フォーカス管理デモ
function FocusDemo() {
  const { inputRef, buttonRef, focusInput, focusButton, blurInput } = useFocus();

  return (
    <div className={styles.demoSection}>
      <h3>フォーカス管理</h3>
      <div className={styles.focusSection}>
        <div className={styles.inputGroup}>
          <input
            ref={inputRef}
            type="text"
            placeholder="フォーカス対象の入力フィールド"
            className={styles.input}
          />
          <button ref={buttonRef} className={styles.button}>
            フォーカス対象のボタン
          </button>
        </div>
        
        <div className={styles.buttonGroup}>
          <button onClick={focusInput} className={styles.button}>
            入力フィールドにフォーカス
          </button>
          <button onClick={focusButton} className={styles.button}>
            ボタンにフォーカス
          </button>
          <button onClick={blurInput} className={styles.button}>
            入力フィールドのフォーカスを外す
          </button>
        </div>
      </div>
    </div>
  );
}

// スクロール管理デモ
function ScrollDemo() {
  const { scrollRef, scrollPosition, scrollToTop, scrollToBottom, scrollToElement } = useScrollPosition();

  return (
    <div className={styles.demoSection}>
      <h3>スクロール位置管理</h3>
      <div className={styles.scrollSection}>
        <p>現在のスクロール位置: {scrollPosition}px</p>
        
        <div className={styles.buttonGroup}>
          <button onClick={scrollToTop} className={styles.button}>
            トップにスクロール
          </button>
          <button onClick={scrollToBottom} className={styles.button}>
            ボトムにスクロール
          </button>
          <button onClick={() => scrollToElement('title')} className={styles.button}>
            タイトルにスクロール
          </button>
        </div>
        
        <div 
          ref={scrollRef} 
          className={styles.scrollableContent}
        >
          <div className={styles.scrollItem}>スクロール項目 1</div>
          <div className={styles.scrollItem}>スクロール項目 2</div>
          <div className={styles.scrollItem}>スクロール項目 3</div>
          <div className={styles.scrollItem}>スクロール項目 4</div>
          <div className={styles.scrollItem}>スクロール項目 5</div>
          <div className={styles.scrollItem}>スクロール項目 6</div>
          <div className={styles.scrollItem}>スクロール項目 7</div>
          <div className={styles.scrollItem}>スクロール項目 8</div>
          <div className={styles.scrollItem}>スクロール項目 9</div>
          <div className={styles.scrollItem}>スクロール項目 10</div>
        </div>
      </div>
    </div>
  );
}

// ビデオプレーヤーデモ
function VideoPlayerDemo() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.demoSection}>
      <h3>ビデオプレーヤー制御</h3>
      <div className={styles.videoSection}>
        <video
          ref={videoRef}
          className={styles.video}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
          お使いのブラウザはビデオタグをサポートしていません。
        </video>
        
        <div className={styles.videoControls}>
          <button onClick={togglePlay} className={styles.button}>
            {isPlaying ? '一時停止' : '再生'}
          </button>
          
          <div className={styles.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className={styles.seekButtons}>
            <button onClick={() => seekTo(0)} className={styles.button}>開始</button>
            <button onClick={() => seekTo(duration / 2)} className={styles.button}>中間</button>
            <button onClick={() => seekTo(duration)} className={styles.button}>終了</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function UseRefPage() {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const previousInputValue = usePrevious(inputValue);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title} id="title">useRef 学習ページ</h1>
        
        <p className={styles.description}>
          useRefは、DOM要素への直接アクセスや、レンダリング間で値を保持するために使用されるReactフックです。
          DOM操作、フォーカス管理、スクロール制御など、多くの実用的な機能を実装できます。
        </p>

        <div className={styles.content}>
          {/* useRefの基本概念 */}
          <section className={styles.section}>
            <h2>1. useRefの基本概念</h2>
            <div className={styles.concept}>
              <h3>useRefとは</h3>
              <ul>
                <li>DOM要素への直接アクセスを可能にする</li>
                <li>レンダリング間で値を保持する</li>
                <li>コンポーネントの再レンダリングを引き起こさない</li>
                <li>ref.currentプロパティで値にアクセス</li>
              </ul>
              
              <h3>基本的な使い方</h3>
              <code className={styles.code}>
                {`const ref = useRef(initialValue);
// ref.currentで値にアクセス
console.log(ref.current);`}
              </code>
              
              <h3>主な用途</h3>
              <ul>
                <li><strong>DOM要素へのアクセス</strong>: input、video、canvasなどの制御</li>
                <li><strong>値の保持</strong>: 前の値、タイマーID、インスタンス変数</li>
                <li><strong>フォーカス管理</strong>: 入力フィールドのフォーカス制御</li>
                <li><strong>スクロール制御</strong>: スクロール位置の管理</li>
                <li><strong>アニメーション</strong>: requestAnimationFrameの制御</li>
              </ul>
            </div>
          </section>

          {/* フォーカス管理 */}
          <section className={styles.section}>
            <h2>2. フォーカス管理</h2>
            <p className={styles.explanation}>
              useRefを使って入力フィールドやボタンのフォーカスをプログラムで制御できます。
              フォームの自動フォーカスや、エラー後のフォーカス移動などで便利です。
            </p>
            <FocusDemo />
          </section>

          {/* スクロール制御 */}
          <section className={styles.section}>
            <h2>3. スクロール制御</h2>
            <p className={styles.explanation}>
              スクロール可能な要素の位置を監視し、特定の位置へのスクロールを制御できます。
              チャットアプリや長いリストでの自動スクロールなどで使用されます。
            </p>
            <ScrollDemo />
          </section>

          {/* 前の値の追跡 */}
          <section className={styles.section}>
            <h2>4. 前の値の追跡</h2>
            <p className={styles.explanation}>
              useRefを使って前の値を保持し、現在の値と比較できます。
              値の変化を検出したり、アニメーションの前の状態を記録したりするのに便利です。
            </p>
            <CounterWithPrevious />
          </section>

          {/* ビデオプレーヤー制御 */}
          <section className={styles.section}>
            <h2>5. メディア要素の制御</h2>
            <p className={styles.explanation}>
              video、audio、canvasなどのメディア要素をuseRefで直接制御できます。
              再生/一時停止、シーク、音量制御などの機能を実装できます。
            </p>
            <VideoPlayerDemo />
          </section>

          {/* 実用的な例 */}
          <section className={styles.section}>
            <h2>6. 実用的な例</h2>
            <div className={styles.concept}>
              <h3>入力フィールドの自動フォーカス</h3>
              <div className={styles.inputGroup}>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="入力してください..."
                  className={styles.input}
                />
                <button onClick={() => inputRef.current?.focus()} className={styles.button}>
                  フォーカス
                </button>
              </div>
              
              <div className={styles.infoBox}>
                <p><strong>現在の値:</strong> {inputValue}</p>
                <p><strong>前の値:</strong> {previousInputValue !== undefined ? previousInputValue : 'なし'}</p>
              </div>
              
              <h3>よくある使用パターン</h3>
              <ul>
                <li><strong>フォームの自動フォーカス</strong>: ページ読み込み後の自動フォーカス</li>
                <li><strong>エラー後のフォーカス移動</strong>: バリデーションエラー後の自動フォーカス</li>
                <li><strong>モーダルのフォーカス管理</strong>: アクセシビリティの向上</li>
                <li><strong>スクロール位置の記録</strong>: ページ遷移前の位置を保持</li>
                <li><strong>タイマーの管理</strong>: setIntervalやsetTimeoutのIDを保持</li>
              </ul>
              
              <h3>注意点</h3>
              <ul>
                <li>ref.currentはnullの可能性があるため、オプショナルチェーン（?.）を使用</li>
                <li>DOM要素への直接アクセスは避け、可能な限りReactの宣言的なアプローチを使用</li>
                <li>refの値の変更は再レンダリングを引き起こさない</li>
                <li>useEffect内でrefの値を監視する場合は注意が必要</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
