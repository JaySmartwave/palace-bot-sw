import React from 'react';

import styles from './index.module.scss';
import cssModules from 'react-css-modules';

const ImageDropzone = (props) => (
  <div className={styles.imageDropzone}>
  </div>
);


export default cssModules(ImageDropzone, styles);
