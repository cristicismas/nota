import { type Component } from 'solid-js';

import Sidebar from './components/Sidebar'
import PageContent from './components/PageContent'

import styles from './App.module.css';

const App: Component = () => {
  return (
    <div class={styles.app}>
      <Sidebar />

      <PageContent />
    </div>
  );
};

export default App;
