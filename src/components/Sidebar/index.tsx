import { type Component } from 'solid-js';
import styles from './styles.module.css';

const Sidebar: Component = () => {
  return <aside class={styles.sidebar}>
    <h1 class={styles.title}>Nota</h1>

    <div class={styles.links}>
      <a href="/project-1">Project 1</a>
      <a href="/project-2">Project 2</a>
      <a href="/project-3">Project 3</a>
    </div>
  </aside>;
};

export default Sidebar;
