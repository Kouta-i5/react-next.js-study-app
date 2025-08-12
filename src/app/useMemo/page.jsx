'use client';
import styles from "@/app/useMemo/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState, useMemo } from 'react';

export default function UseMemoPage() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [items, setItems] = useState([
    { id: 1, name: 'りんご', price: 150, category: '果物' },
    { id: 2, name: 'バナナ', price: 100, category: '果物' },
    { id: 3, name: 'にんじん', price: 80, category: '野菜' },
    { id: 4, name: 'トマト', price: 120, category: '野菜' },
    { id: 5, name: 'パン', price: 200, category: 'パン' },
    { id: 6, name: '牛乳', price: 180, category: '乳製品' },
    { id: 7, name: 'チーズ', price: 300, category: '乳製品' },
    { id: 8, name: '米', price: 500, category: '穀物' }
  ]);

  // 1. 基本的なuseMemo（高価な計算）
  const expensiveCalculation = useMemo(() => {
    console.log('高価な計算を実行中...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  }, [count]); // countが変更されたときにのみ再計算

  // 2. フィルタリングとソートのuseMemo
  const filteredAndSortedItems = useMemo(() => {
    console.log('アイテムのフィルタリングとソートを実行中...');
    return items
      .filter(item => 
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.category.toLowerCase().includes(text.toLowerCase())
      )
      .sort((a, b) => a.price - b.price);
  }, [items, text]); // itemsまたはtextが変更されたときにのみ再計算

  // 3. 統計情報の計算
  const itemStats = useMemo(() => {
    console.log('統計情報を計算中...');
    const totalItems = items.length;
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;
    
    const categoryCount = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    const mostExpensive = items.reduce((max, item) => 
      item.price > max.price ? item : max, items[0] || {}
    );
    
    const leastExpensive = items.reduce((min, item) => 
      item.price < min.price ? item : min, items[0] || {}
    );
    
    return {
      totalItems,
      totalPrice,
      averagePrice: averagePrice.toFixed(0),
      categoryCount,
      mostExpensive,
      leastExpensive
    };
  }, [items]); // itemsが変更されたときにのみ再計算

  // 4. カテゴリ別のグループ化
  const itemsByCategory = useMemo(() => {
    console.log('カテゴリ別にグループ化中...');
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items]); // itemsが変更されたときにのみ再計算

  // 5. 価格帯別の分析
  const priceAnalysis = useMemo(() => {
    console.log('価格帯分析を実行中...');
    const lowPrice = items.filter(item => item.price < 100);
    const mediumPrice = items.filter(item => item.price >= 100 && item.price < 200);
    const highPrice = items.filter(item => item.price >= 200);
    
    return {
      low: { count: lowPrice.length, items: lowPrice },
      medium: { count: mediumPrice.length, items: mediumPrice },
      high: { count: highPrice.length, items: highPrice }
    };
  }, [items]); // itemsが変更されたときにのみ再計算

  // 6. 検索結果のハイライト
  const highlightedItems = useMemo(() => {
    if (!text) return items;
    
    return items.map(item => ({
      ...item,
      highlightedName: item.name.replace(
        new RegExp(`(${text})`, 'gi'),
        '<mark>$1</mark>'
      )
    }));
  }, [items, text]); // itemsまたはtextが変更されたときにのみ再計算

  // 7. パフォーマンス比較用の関数（useMemoなし）
  const calculateWithoutMemo = () => {
    console.log('useMemoなしで計算中...');
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sqrt(i);
    }
    return result.toFixed(2);
  };

  // 8. 複雑なオブジェクトの作成
  const complexObject = useMemo(() => {
    console.log('複雑なオブジェクトを作成中...');
    return {
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        lastUpdated: Date.now()
      },
      summary: {
        totalCategories: Object.keys(itemStats.categoryCount).length,
        priceRange: {
          min: itemStats.leastExpensive.price,
          max: itemStats.mostExpensive.price
        }
      },
      recommendations: items
        .filter(item => item.price < 150)
        .slice(0, 3)
        .map(item => ({ name: item.name, reason: 'お得な価格' }))
    };
  }, [items, itemStats]); // itemsまたはitemStatsが変更されたときにのみ再計算

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>useMemo 学習ページ</h1>
        
        {/* 基本的なuseMemo */}
        <section className={styles.section}>
          <h2>1. 基本的なuseMemo（高価な計算）</h2>
          <p>現在のカウント: <strong>{count}</strong></p>
          <div className={styles.buttonGroup}>
            <button onClick={() => setCount(c => c + 1)} className={styles.button}>
              カウント増加
            </button>
            <button onClick={() => setCount(0)} className={styles.button}>
              リセット
            </button>
          </div>
          <div className={styles.calculationResult}>
            <h3>計算結果（useMemo使用）:</h3>
            <p className={styles.resultValue}>{expensiveCalculation}</p>
            <button onClick={() => calculateWithoutMemo()} className={styles.button}>
              useMemoなしで計算
            </button>
          </div>
          <p className={styles.explanation}>
            useMemoを使用することで、countが変更されたときのみ高価な計算が実行されます。
          </p>
        </section>

        {/* 検索とフィルタリング */}
        <section className={styles.section}>
          <h2>2. 検索とフィルタリングのuseMemo</h2>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="商品名やカテゴリで検索..."
            className={styles.input}
          />
          <p>検索結果: <strong>{filteredAndSortedItems.length}</strong>件</p>
          
          <div className={styles.searchResults}>
            {filteredAndSortedItems.map(item => (
              <div key={item.id} className={styles.itemCard}>
                <h4>{item.name}</h4>
                <p>カテゴリ: {item.category}</p>
                <p>価格: ¥{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 統計情報 */}
        <section className={styles.section}>
          <h2>3. 統計情報の表示</h2>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h3>総商品数</h3>
              <p className={styles.statValue}>{itemStats.totalItems}</p>
            </div>
            <div className={styles.statItem}>
              <h3>総価格</h3>
              <p className={styles.statValue}>¥{itemStats.totalPrice}</p>
            </div>
            <div className={styles.statItem}>
              <h3>平均価格</h3>
              <p className={styles.statValue}>¥{itemStats.averagePrice}</p>
            </div>
            <div className={styles.statItem}>
              <h3>最高価格</h3>
              <p className={styles.statValue}>¥{itemStats.mostExpensive.price}</p>
            </div>
          </div>
          
          <div className={styles.categoryStats}>
            <h3>カテゴリ別商品数:</h3>
            <div className={styles.categoryGrid}>
              {Object.entries(itemStats.categoryCount).map(([category, count]) => (
                <div key={category} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryCount}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* カテゴリ別グループ化 */}
        <section className={styles.section}>
          <h2>4. カテゴリ別グループ化</h2>
          <div className={styles.categoryGroups}>
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
              <div key={category} className={styles.categoryGroup}>
                <h3>{category} ({categoryItems.length}件)</h3>
                <div className={styles.categoryItems}>
                  {categoryItems.map(item => (
                    <div key={item.id} className={styles.categoryItemCard}>
                      {item.name} - ¥{item.price}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 価格帯分析 */}
        <section className={styles.section}>
          <h2>5. 価格帯別分析</h2>
          <div className={styles.priceAnalysis}>
            <div className={styles.priceTier}>
              <h3>低価格帯 (¥100未満)</h3>
              <p>商品数: {priceAnalysis.low.count}</p>
              <div className={styles.priceItems}>
                {priceAnalysis.low.items.map(item => (
                  <span key={item.id} className={styles.priceItem}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.priceTier}>
              <h3>中価格帯 (¥100-¥199)</h3>
              <p>商品数: {priceAnalysis.medium.count}</p>
              <div className={styles.priceItems}>
                {priceAnalysis.medium.items.map(item => (
                  <span key={item.id} className={styles.priceItem}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.priceTier}>
              <h3>高価格帯 (¥200以上)</h3>
              <p>商品数: {priceAnalysis.high.count}</p>
              <div className={styles.priceItems}>
                {priceAnalysis.high.items.map(item => (
                  <span key={item.id} className={styles.priceItem}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 複雑なオブジェクト */}
        <section className={styles.section}>
          <h2>6. 複雑なオブジェクトの作成</h2>
          <div className={styles.complexObject}>
            <h3>メタデータ:</h3>
            <p>作成日時: {complexObject.metadata.createdAt}</p>
            <p>バージョン: {complexObject.metadata.version}</p>
            <p>最終更新: {new Date(complexObject.metadata.lastUpdated).toLocaleString()}</p>
            
            <h3>サマリー:</h3>
            <p>総カテゴリ数: {complexObject.summary.totalCategories}</p>
            <p>価格範囲: ¥{complexObject.summary.priceRange.min} - ¥{complexObject.summary.priceRange.max}</p>
            
            <h3>おすすめ商品:</h3>
            <ul>
              {complexObject.recommendations.map((rec, index) => (
                <li key={index}>{rec.name} - {rec.reason}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* useMemoの説明 */}
        <section className={styles.section}>
          <h2>useMemo の基本概念</h2>
          <div className={styles.concept}>
            <h3>構文</h3>
            <code className={styles.code}>
              const memoizedValue = useMemo(() => { /* 計算処理 */ }, [依存配列]);
            </code>
            
            <h3>パラメータ</h3>
            <ul>
              <li><strong>計算関数</strong>: 値を計算する関数</li>
              <li><strong>依存配列</strong>: 値が再計算される条件</li>
            </ul>
            
            <h3>戻り値</h3>
            <ul>
              <li><strong>memoizedValue</strong>: メモ化された値</li>
            </ul>
            
            <h3>依存配列のパターン</h3>
            <ul>
              <li><strong>[]</strong>: 値は再計算されない（マウント時のみ計算）</li>
              <li><strong>[value]</strong>: 指定した値が変更されたときにのみ再計算</li>
              <li><strong>なし</strong>: 毎回のレンダリングで再計算（非推奨）</li>
            </ul>
            
            <h3>重要なポイント</h3>
            <ul>
              <li>高価な計算結果をキャッシュしてパフォーマンスを最適化</li>
              <li>依存配列を適切に設定することが重要</li>
              <li>オブジェクトや配列の参照の同一性を保つ</li>
              <li>過度な最適化は避ける（必要以上に使わない）</li>
              <li>useCallbackと組み合わせて使用することが多い</li>
              <li>React.memoと組み合わせると効果的</li>
            </ul>
            
            <h3>使用すべき場面</h3>
            <ul>
              <li>高価な計算処理</li>
              <li>大きな配列のフィルタリングやソート</li>
              <li>オブジェクトの作成</li>
              <li>子コンポーネントに渡すprops</li>
              <li>useEffectの依存配列に含める値</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
