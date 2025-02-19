import { createSignal, type Component } from 'solid-js';

import styles from './App.module.css';

const App: Component = () => {
  const [count, setCount] = createSignal(10)

  return (
    <div class={styles.app}>
      {count()}
    </div>
  );
};

export default App;
