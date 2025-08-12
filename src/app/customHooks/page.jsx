'use client';
import styles from "@/app/customHooks/page.module.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// カスタムフック: カウンター
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + step);
  }, [step]);

  const decrement = useCallback(() => {
    setCount(prev => prev - step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
}

// カスタムフック: フォーム管理
function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 || 
           Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    reset,
    isValid
  };
}

// カスタムフック: API呼び出し
function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // 実際のAPIの代わりにsetTimeoutでシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // モックデータ
      const mockData = {
        users: [
          { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
          { id: 2, name: '佐藤花子', email: 'sato@example.com' },
          { id: 3, name: '鈴木一郎', email: 'suzuki@example.com' }
        ],
        posts: [
          { id: 1, title: 'Reactの基本', content: 'Reactは素晴らしいライブラリです' },
          { id: 2, title: 'カスタムフック', content: 'カスタムフックでコードを整理しましょう' }
        ]
      };
      
      setData(mockData[endpoint] || mockData.users);
    } catch (err) {
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);

  return {
    data,
    loading,
    error,
    fetchData,
    refetch
  };
}

// カスタムフック: ローカルストレージ
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// カスタムフック: ウィンドウサイズ
function useWindowSize() {
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// カスタムフック: キーボードショートカット
function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrlKey = false, shiftKey = false, altKey = false } = options;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === key &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrlKey, shiftKey, altKey]);
}

// カスタムフック: オンライン状態
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// カスタムフック: デバウンス
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// カスタムフック: 前の値
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

// カスタムフック: インターバル
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

// カスタムフック: タイマー
function useTimer(initialTime = 0, autoStart = false) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setTime(initialTime);
    setIsRunning(false);
  }, [initialTime]);

  return { time, isRunning, start, stop, reset };
}

// カスタムフック: useRefを使ったフォーカス管理
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

// カスタムフック: useRefを使ったスクロール位置管理
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

// カスタムフック: useReducerを使った複雑な状態管理
function useTodoList() {
  const todoReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_TODO':
        return {
          ...state,
          todos: [...state.todos, {
            id: Date.now(),
            text: action.payload,
            completed: false,
            priority: 'medium',
            createdAt: new Date()
          }]
        };
      
      case 'TOGGLE_TODO':
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        };
      
      case 'DELETE_TODO':
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        };
      
      case 'UPDATE_TODO':
        return {
          ...state,
          todos: state.todos.map(todo =>
            todo.id === action.payload.id
              ? { ...todo, ...action.payload.updates }
              : todo
          )
        };
      
      case 'SET_FILTER':
        return {
          ...state,
          filter: action.payload
        };
      
      case 'SET_SORT':
        return {
          ...state,
          sortBy: action.payload
        };
      
      case 'CLEAR_COMPLETED':
        return {
          ...state,
          todos: state.todos.filter(todo => !todo.completed)
        };
      
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all', // all, active, completed
    sortBy: 'createdAt' // createdAt, priority, text
  });

  const addTodo = useCallback((text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  }, []);

  const toggleTodo = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }, []);

  const deleteTodo = useCallback((id) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }, []);

  const updateTodo = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TODO', payload: { id, updates } });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setSort = useCallback((sortBy) => {
    dispatch({ type: 'SET_SORT', payload: sortBy });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = state.todos;
    
    // フィルタリング
    if (state.filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (state.filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // ソート
    filtered.sort((a, b) => {
      if (state.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (state.sortBy === 'text') {
        return a.text.localeCompare(b.text);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    return filtered;
  }, [state.todos, state.filter, state.sortBy]);

  return {
    todos: filteredAndSortedTodos,
    filter: state.filter,
    sortBy: state.sortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSort,
    clearCompleted
  };
}

// カスタムフック: useReducerを使ったショッピングカート
function useShoppingCart() {
  const cartReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        const existingItem = state.items.find(item => item.id === action.payload.id);
        if (existingItem) {
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        } else {
          return {
            ...state,
            items: [...state.items, { ...action.payload, quantity: 1 }]
          };
        }
      
      case 'REMOVE_ITEM':
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload)
        };
      
      case 'UPDATE_QUANTITY':
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          ).filter(item => item.quantity > 0)
        };
      
      case 'CLEAR_CART':
        return {
          ...state,
          items: []
        };
      
      case 'SET_SHIPPING':
        return {
          ...state,
          shipping: action.payload
        };
      
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    shipping: 'standard'
  });

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setShipping = useCallback((shipping) => {
    dispatch({ type: 'SET_SHIPPING', payload: shipping });
  }, []);

  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = state.shipping === 'express' ? 10 : 5;
    return subtotal + shippingCost;
  }, [state.items, state.shipping]);

  return {
    items: state.items,
    shipping: state.shipping,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setShipping
  };
}

// カウンターコンポーネント
function CounterDemo() {
  const counter1 = useCounter(0, 1);
  const counter2 = useCounter(10, 5);

  return (
    <div className={styles.demoSection}>
      <h3>カウンター1 (ステップ: 1)</h3>
      <div className={styles.counterDisplay}>
        <span>値: {counter1.count}</span>
        <div className={styles.buttonGroup}>
          <button onClick={counter1.decrement} className={styles.button}>-</button>
          <button onClick={counter1.reset} className={styles.button}>リセット</button>
          <button onClick={counter1.increment} className={styles.button}>+</button>
        </div>
      </div>

      <h3>カウンター2 (ステップ: 5)</h3>
      <div className={styles.counterDisplay}>
        <span>値: {counter2.count}</span>
        <div className={styles.buttonGroup}>
          <button onClick={counter2.decrement} className={styles.button}>-</button>
          <button onClick={counter2.reset} className={styles.button}>リセット</button>
          <button onClick={counter2.increment} className={styles.button}>+</button>
        </div>
      </div>
    </div>
  );
}

// フォームデモコンポーネント
function FormDemo() {
  const form = useForm({
    username: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors = {};
    if (!form.values.username) newErrors.username = 'ユーザー名は必須です';
    if (!form.values.email) newErrors.email = 'メールアドレスは必須です';
    if (!form.values.message) newErrors.message = 'メッセージは必須です';
    
    if (Object.keys(newErrors).length === 0) {
      alert('フォームが送信されました！');
      form.reset();
    } else {
      Object.keys(newErrors).forEach(key => {
        form.setFieldError(key, newErrors[key]);
      });
    }
  };

  return (
    <div className={styles.demoSection}>
      <h3>フォーム管理</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>ユーザー名:</label>
          <input
            type="text"
            value={form.values.username}
            onChange={(e) => form.handleChange('username', e.target.value)}
            onBlur={() => form.handleBlur('username')}
            className={styles.input}
          />
          {form.touched.username && form.errors.username && (
            <span className={styles.error}>{form.errors.username}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>メールアドレス:</label>
          <input
            type="email"
            value={form.values.email}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
            className={styles.input}
          />
          {form.touched.email && form.errors.email && (
            <span className={styles.error}>{form.errors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>メッセージ:</label>
          <textarea
            value={form.values.message}
            onChange={(e) => form.handleChange('message', e.target.value)}
            onBlur={() => form.handleBlur('message')}
            className={styles.textarea}
          />
          {form.touched.message && form.errors.message && (
            <span className={styles.error}>{form.errors.message}</span>
          )}
        </div>

        <button type="submit" className={styles.button} disabled={!form.isValid}>
          送信
        </button>
      </form>
    </div>
  );
}

// API呼び出しデモコンポーネント
function ApiDemo() {
  const usersApi = useApi('users');
  const postsApi = useApi('posts', { autoFetch: false });

  return (
    <div className={styles.demoSection}>
      <h3>API呼び出し (ユーザー)</h3>
      <div className={styles.apiSection}>
        <button onClick={usersApi.refetch} className={styles.button}>
          再取得
        </button>
        
        {usersApi.loading && <p className={styles.loading}>読み込み中...</p>}
        {usersApi.error && <p className={styles.error}>{usersApi.error}</p>}
        
        {usersApi.data && (
          <div className={styles.dataList}>
            {usersApi.data.map(user => (
              <div key={user.id} className={styles.dataItem}>
                <strong>{user.name}</strong> - {user.email}
              </div>
            ))}
          </div>
        )}
      </div>

      <h3>API呼び出し (投稿)</h3>
      <div className={styles.apiSection}>
        <button onClick={postsApi.fetchData} className={styles.button}>
          データ取得
        </button>
        
        {postsApi.loading && <p className={styles.loading}>読み込み中...</p>}
        {postsApi.error && <p className={styles.error}>{postsApi.error}</p>}
        
        {postsApi.data && (
          <div className={styles.dataList}>
            {postsApi.data.map(post => (
              <div key={post.id} className={styles.dataItem}>
                <strong>{post.title}</strong> - {post.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ローカルストレージデモコンポーネント
function LocalStorageDemo() {
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote, date: new Date() }]);
      setNewNote('');
    }
  };

  const removeNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className={styles.demoSection}>
      <h3>ローカルストレージ</h3>
      <div className={styles.storageSection}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="新しいメモを入力"
            className={styles.input}
          />
          <button onClick={addNote} className={styles.button}>追加</button>
        </div>
        
        <div className={styles.notesList}>
          {notes.map(note => (
            <div key={note.id} className={styles.noteItem}>
              <span>{note.text}</span>
              <button 
                onClick={() => removeNote(note.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// useRefを使ったフォーカス管理デモ
function FocusDemo() {
  const { inputRef, buttonRef, focusInput, focusButton, blurInput } = useFocus();

  return (
    <div className={styles.demoSection}>
      <h3>useRef - フォーカス管理</h3>
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

// useRefを使ったスクロール管理デモ
function ScrollDemo() {
  const { scrollRef, scrollPosition, scrollToTop, scrollToBottom, scrollToElement } = useScrollPosition();

  return (
    <div className={styles.demoSection}>
      <h3>useRef - スクロール位置管理</h3>
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

// useReducerを使ったTodoリストデモ
function TodoListDemo() {
  const {
    todos,
    filter,
    sortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter,
    setSort,
    clearCompleted
  } = useTodoList();

  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <div className={styles.demoSection}>
      <h3>useReducer - Todoリスト管理</h3>
      <div className={styles.todoSection}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="新しいタスクを入力"
            className={styles.input}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button onClick={handleAddTodo} className={styles.button}>追加</button>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <label>フィルター:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className={styles.select}>
              <option value="all">すべて</option>
              <option value="active">未完了</option>
              <option value="completed">完了済み</option>
            </select>
          </div>
          
          <div className={styles.sortGroup}>
            <label>ソート:</label>
            <select value={sortBy} onChange={(e) => setSort(e.target.value)} className={styles.select}>
              <option value="createdAt">作成日時</option>
              <option value="priority">優先度</option>
              <option value="text">テキスト</option>
            </select>
          </div>
          
          <button onClick={clearCompleted} className={styles.button}>
            完了済みを削除
          </button>
        </div>
        
        <div className={styles.todoList}>
          {todos.map(todo => (
            <div key={todo.id} className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className={styles.checkbox}
              />
              <span className={styles.todoText}>{todo.text}</span>
              <span className={styles.todoPriority}>{todo.priority}</span>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// useReducerを使ったショッピングカートデモ
function ShoppingCartDemo() {
  const {
    items,
    shipping,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setShipping
  } = useShoppingCart();

  const sampleProducts = [
    { id: 1, name: 'React本', price: 3000 },
    { id: 2, name: 'TypeScript本', price: 3500 },
    { id: 3, name: 'Next.js本', price: 4000 }
  ];

  return (
    <div className={styles.demoSection}>
      <h3>useReducer - ショッピングカート</h3>
      <div className={styles.cartSection}>
        <div className={styles.products}>
          <h4>商品一覧</h4>
          {sampleProducts.map(product => (
            <div key={product.id} className={styles.productItem}>
              <span>{product.name} - ¥{product.price}</span>
              <button onClick={() => addItem(product)} className={styles.button}>
                カートに追加
              </button>
            </div>
          ))}
        </div>
        
        <div className={styles.cart}>
          <h4>ショッピングカート ({totalItems}個)</h4>
          
          <div className={styles.shippingSelect}>
            <label>配送方法:</label>
            <select value={shipping} onChange={(e) => setShipping(e.target.value)} className={styles.select}>
              <option value="standard">標準配送 (¥5)</option>
              <option value="express">速達配送 (¥10)</option>
            </select>
          </div>
          
          {items.length === 0 ? (
            <p>カートは空です</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <span>{item.name}</span>
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.quantityButton}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                    <span>¥{item.price * item.quantity}</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartTotal}>
                <strong>合計: ¥{totalPrice}</strong>
              </div>
              
              <button onClick={clearCart} className={styles.button}>
                カートを空にする
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// メインコンポーネント
export default function CustomHooksPage() {
  const windowSize = useWindowSize();
  const isOnline = useOnlineStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const timer = useTimer(0, false);

  // キーボードショートカット
  useKeyboardShortcut('s', () => {
    alert('Sキーが押されました！');
  });

  useKeyboardShortcut('r', () => {
    alert('Rキーが押されました！');
  });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>カスタムフック 学習ページ</h1>
        
        <p className={styles.description}>
          カスタムフックは、Reactのロジックを再利用可能な関数に抽出するための機能です。
          共通の状態ロジックをカスタムフックとして分離することで、コードの可読性と保守性が向上します。
        </p>

        <div className={styles.content}>
          {/* 基本的なカスタムフック */}
          <section className={styles.section}>
            <h2>1. 基本的なカスタムフック</h2>
            <p className={styles.explanation}>
              シンプルな状態管理とロジックをカスタムフックとして実装します。
            </p>
            <CounterDemo />
          </section>

          {/* フォーム管理 */}
          <section className={styles.section}>
            <h2>2. フォーム管理のカスタムフック</h2>
            <p className={styles.explanation}>
              フォームの状態管理、バリデーション、エラーハンドリングを統合したカスタムフックです。
            </p>
            <FormDemo />
          </section>

          {/* API呼び出し */}
          <section className={styles.section}>
            <h2>3. API呼び出しのカスタムフック</h2>
            <p className={styles.explanation}>
              データ取得、ローディング状態、エラーハンドリングを管理するカスタムフックです。
            </p>
            <ApiDemo />
          </section>

          {/* ローカルストレージ */}
          <section className={styles.section}>
            <h2>4. ローカルストレージのカスタムフック</h2>
            <p className={styles.explanation}>
              ローカルストレージとの同期を簡単にするカスタムフックです。
            </p>
            <LocalStorageDemo />
          </section>

          {/* useRefを使ったカスタムフック */}
          <section className={styles.section}>
            <h2>5. useRefを使ったカスタムフック</h2>
            <p className={styles.explanation}>
              useRefを使ってDOM要素への直接アクセスやフォーカス管理、スクロール制御を行うカスタムフックです。
            </p>
            <FocusDemo />
            <ScrollDemo />
          </section>

          {/* useReducerを使ったカスタムフック */}
          <section className={styles.section}>
            <h2>6. useReducerを使ったカスタムフック</h2>
            <p className={styles.explanation}>
              useReducerを使って複雑な状態管理を行うカスタムフックです。複数のアクションと状態の組み合わせを効率的に管理できます。
            </p>
            <TodoListDemo />
            <ShoppingCartDemo />
          </section>

          {/* その他のカスタムフック */}
          <section className={styles.section}>
            <h2>7. その他のカスタムフック</h2>
            <p className={styles.explanation}>
              様々な用途に特化したカスタムフックの例です。
            </p>
            
            <div className={styles.hooksGrid}>
              <div className={styles.hookCard}>
                <h3>ウィンドウサイズ</h3>
                <p>幅: {windowSize.width}px, 高さ: {windowSize.height}px</p>
              </div>
              
              <div className={styles.hookCard}>
                <h3>オンライン状態</h3>
                <p className={isOnline ? styles.online : styles.offline}>
                  {isOnline ? 'オンライン' : 'オフライン'}
                </p>
              </div>
              
              <div className={styles.hookCard}>
                <h3>デバウンス検索</h3>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="検索語を入力..."
                  className={styles.input}
                />
                <p>デバウンス後: {debouncedSearchTerm}</p>
              </div>
              
              <div className={styles.hookCard}>
                <h3>タイマー</h3>
                <p>時間: {timer.time}秒</p>
                <div className={styles.buttonGroup}>
                  <button onClick={timer.start} className={styles.button} disabled={timer.isRunning}>
                    開始
                  </button>
                  <button onClick={timer.stop} className={styles.button} disabled={!timer.isRunning}>
                    停止
                  </button>
                  <button onClick={timer.reset} className={styles.button}>
                    リセット
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* カスタムフックの説明 */}
          <section className={styles.section}>
            <h2>カスタムフック の基本概念</h2>
            <div className={styles.concept}>
              <h3>命名規則</h3>
              <ul>
                <li>必ず「use」で始める（例: useCounter, useForm）</li>
                <li>Reactフックのルールに従う</li>
                <li>他のカスタムフックを呼び出すことができる</li>
              </ul>
              
              <h3>基本的な構造</h3>
              <code className={styles.code}>
                {`function useCustomHook(initialValue) {
  const [state, setState] = useState(initialValue);
  
  const updateState = useCallback((newValue) => {
    setState(newValue);
  }, []);
  
  return { state, updateState };
}`}
              </code>
              
              <h3>メリット</h3>
              <ul>
                <li>ロジックの再利用性が向上</li>
                <li>コンポーネントの可読性が向上</li>
                <li>テストが書きやすくなる</li>
                <li>関心の分離が明確になる</li>
              </ul>
              
              <h3>よく使われるパターン</h3>
              <ul>
                <li><strong>状態管理</strong>: useState, useReducer</li>
                <li><strong>副作用</strong>: useEffect</li>
                <li><strong>最適化</strong>: useMemo, useCallback</li>
                <li><strong>外部連携</strong>: API呼び出し、ローカルストレージ</li>
                <li><strong>イベント処理</strong>: キーボード、マウス、スクロール</li>
              </ul>
              
              <h3>注意点</h3>
              <ul>
                <li>Reactフックのルールを必ず守る</li>
                <li>条件分岐内でフックを呼び出さない</li>
                <li>ループ内でフックを呼び出さない</li>
                <li>ネストした関数内でフックを呼び出さない</li>
                <li>カスタムフック内でも他のフックのルールが適用される</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
