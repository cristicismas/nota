import { type Component } from 'solid-js';
import { A } from '@solidjs/router'
import styles from './styles.module.css';

const Sidebar: Component = () => {
  return <aside class={styles.sidebar}>
    <h1 class={styles.title}>Nota</h1>

    <div class={styles.links}>
      <A href="/project-1">Project 1</A>
      <A href="/project-2">Project 2</A>
      <A href="/project-3">Project 3</A>
    </div>
  </aside>;
};

export default Sidebar;
