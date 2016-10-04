import React from 'react';
import cssModules from 'react-css-modules';
import styles from './index.module.scss';


// Pages map directly to Routes, i.e. one page equals on Route

const SchedulePage = (props) => (
  <div className={styles.container}>
    Hello from SchedulePage !
  </div>
);

export default cssModules(SchedulePage, styles);
