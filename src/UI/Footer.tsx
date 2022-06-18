import * as React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer>
            <a href="https://github.com/kiabq/minesweeper-clone">Git
                <img src={require('./images/githubicon.png')} className={styles.footerIcon} />
            </a>
        </footer>
    )
}

export default Footer;