import styles from './Loader.module.css';
import gif from '../../asset/preloader.gif';

function Loader() {
  return (
    <div className={styles.loading_page}>
      <div className={styles.loading_center_page}>
        <div className={styles.loading_center_absolute}>
          <img src={gif} alt="loading..." loading='lazy'/>
        </div>
      </div>
    </div>
  )
}

export default Loader