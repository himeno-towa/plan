import React from 'react';
import Link from 'next/link';
import { Button, Box, Link as MuiLink } from '@mui/material';
import styles from '../style/header.module.css';

const Header: React.FC = () => {
    return (
        <Box className={styles.header}>
            <Box className={styles.toolbar}>
                <h3>Planner</h3>
                <Box className={styles.buttonContainer}>
                    <MuiLink href="/archive">
                        <Button disableElevation className={styles.button}>
                            Archive
                        </Button>
                    </MuiLink>
                    <MuiLink href="/message">
                        <Button disableElevation className={styles.button}>
                            Message
                        </Button>
                    </MuiLink>
                    <MuiLink href="/note">
                        <Button disableElevation className={styles.button}>
                            Note
                        </Button>
                    </MuiLink>
                    <MuiLink href="/diary">
                        <Button disableElevation className={styles.button}>
                            Diary
                        </Button>
                    </MuiLink>
                    <MuiLink href="/planner">
                        <Button disableElevation className={styles.button}>
                            Planner
                        </Button>
                    </MuiLink>
                </Box>
            </Box>
        </Box>
    );
};

export default Header;
