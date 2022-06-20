import * as React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer>
            <a href="https://github.com/kiabq/minesweeper-clone" target={"_blank"}>
                <img src={require('../../common/images/octocat.png')} className={styles.footerIcon} alt={"Git Repo"}/>
            </a>
        </footer>
    )
}

export default Footer;