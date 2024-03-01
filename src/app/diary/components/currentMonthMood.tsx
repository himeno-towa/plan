'use client'
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import axios from 'axios';

const moodChoose = ["٩(◕‿◕｡)۶", " (´；ω；`)", "｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡", " (╬ Ò ‸ Ó)", "(≧◡≦)", "(≧∇≦)", "(´～｀)", " (´∀｀)♡", "(ﾉ*>∀<)ﾉ", "（╥_╥）"];
const MAX_RETRY_COUNT = 5;
const MoodTracker: React.FC<{ currentDate: string }> = ({ currentDate }) => {
    const [moodData, setMoodData] = useState<{ day: string; mood: string }[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newMood, setNewMood] = useState<string>('');

    const fetchMoodData = async (retryCount = 0) => {
        try {
            const month = currentDate.substring(0, 7);

            const response = await axios.get(`diary/${month}-mood.json`);


            const sortedMoodData = response.data.sort((a:{ day: string; mood: string }, b:{ day: string; mood: string }) => parseInt(b.day) - parseInt(a.day));
            setMoodData(sortedMoodData);
        } catch (error) {
            console.error('Error fetching mood data:', error);
            console.error('Error Error Error Error');

            await fetch('/api/pushCurrentDayMood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date: currentDate, mood: '[]' })
            });

            if (retryCount < MAX_RETRY_COUNT) {

                fetchMoodData(retryCount + 1);
            } else {
                console.error('Max retry count reached, giving up.');
            }
        }
    };

    useEffect(() => {

        const checkFileExists = async () => {
            try {
                const month = currentDate.substring(0, 7);
                const filename = `${month}-mood.json`;


                const checkResponse = await axios.get(`/api/checkMoodFile`, {
                    params: {
                        month: month
                    }
                });

                if (checkResponse.data.exists) {

                    fetchMoodData();
                } else {
                    console.log('File does not exist');

                }
                    fetchMoodData();
            } catch (error) {
                await axios.post(`/api/pushCurrentDayMood`, { date: currentDate, mood: '[]' });
                console.error('Error checking file existence:', error);
            }
        };

        checkFileExists();
    }, []);

    const handleAddMood = () => {
        setNewMood('');
        const existingMood = moodData.find(item => item.day === currentDate.substring(8, 10));
        if (existingMood) {
            setNewMood(existingMood.mood);
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSaveMood = async (selectedEmoji: string) => {
        try {
            const response = await axios.post('/api/pushCurrentDayMood', {
                date: currentDate,
                mood: selectedEmoji
            });
            if (response.status === 200) {

                const updatedMoodData = [...moodData];
                const index = updatedMoodData.findIndex(item => item.day === currentDate.substring(8, 10));
                if (index !== -1) {
                    updatedMoodData[index].mood = selectedEmoji;
                    setMoodData(updatedMoodData);
                }
                handleCloseDialog();
            } else {
                console.error('Failed to save mood data');
            }
        } catch (error) {
            console.error('Error saving mood data:', error);
        }
    };

    return (
        <Container>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={12}>
                    <div style={{ margin: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', maxHeight: '55vh', overflowY: 'auto' }}>
                        <Typography variant="h6">{currentDate.substring(0, 7)} 的心情:</Typography>
                        <Button variant="contained" onClick={handleAddMood}>添加/修改今天的心情</Button>
                        <List>
                            {moodData.map(({ day, mood }) => (
                                <ListItem key={day} style={{ justifyContent: 'space-between' }} disablePadding>
                                    <ListItemText primary={`${day}: ${mood || '暂无记录'}`} />
                                </ListItem>
                            ))}
                        </List>
                        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                            <DialogTitle>{`请选择${currentDate}的心情`}</DialogTitle>
                            <DialogContent>
                                <List>
                                    {moodChoose.map((mood, index) => (
                                        <ListItem key={index} onClick={() => handleSaveMood(mood)}>
                                            <ListItemText primary={mood} />
                                        </ListItem>
                                    ))}
                                </List>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog} color="primary">取消</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MoodTracker;
