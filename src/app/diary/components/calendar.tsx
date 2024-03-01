'use client'
import React, { useState, useEffect } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import styles from '../../../style/calednar.module.css'
// @ts-ignore
import {Value} from "react-calendar/src/shared/types";
interface CalendarComponentProps {
    onDateChange: (date: Date) => void;
}

export default function CalendarComponent({ onDateChange }: CalendarComponentProps) {
    const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(new Date());
    const [fileExistsMap, setFileExistsMap] = useState<{ [date: string]: boolean }>({});

    useEffect(() => {
        const fetchDiaryFiles = async () => {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const datesToCheck: Date[] = [];
            for (let i = 1; i <= 31; i++) {
                const date = new Date(currentDate.getFullYear(), currentMonth, i);
                if (date.getMonth() !== currentMonth) {
                    break;
                }
                datesToCheck.push(date);
            }

            const results: { [date: string]: boolean } = {};
            for (const date of datesToCheck) {
                try {
                    const dateString = date.toLocaleDateString('en-CA');
                    const response = await axios.post('/api/checkDiaryFile', { date: dateString });
                    results[dateString] = response.data.fileExists;
                } catch (error) {
                    console.error('Error checking Markdown file:', error);
                    results[date.toLocaleDateString('en-CA')] = false;
                }
            }
            setFileExistsMap(results);
        };

        fetchDiaryFiles();
    }, []);

    const tileClassName = ({ date }: { date: Date }): string => {
        const dateString = date.toLocaleDateString('en-CA');
        return fileExistsMap[dateString] ? styles['current-month'] : '';
    };

    const handleDateChange = (value: Value | Date[] | null, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!value || Array.isArray(value)) {
            return;
        }
    }
    const handleClick = async (value: Date | Date[] | null, event: React.MouseEvent<HTMLButtonElement>) => {
        if (!value || Array.isArray(value)) {
            return;
        }

        const date = value as Date;
        const currentDate = new Date();

        // 将本地日期的时区偏移考虑在内，得到UTC时间
        const selectDate = new Date(date.getTime());
        selectDate.setHours(0);

        console.log("currentDate date:", currentDate);
        console.log("selectDate date:", selectDate);

        if (selectDate <= currentDate) {
            const markdownDate = new Date(selectDate.getTime()); // 复制selectDate
            console.log("markdownDate date:", markdownDate);
            await createMarkdownFile(markdownDate); // 创建 Markdown 文件时使用 UTC 日期
            setSelectedDate(markdownDate);
            onDateChange(markdownDate);
        } else {
            console.log("Selected date is greater than current date, skipping Markdown file creation");
            setSelectedDate(date);
            onDateChange(date);
        }
    };

    const createMarkdownFile = async (date: Date) => {
        try {
            const localDate = date.toLocaleDateString('en-CA');
            console.log("date:", localDate);
            await axios.post('/api/getDiaryFile', { date: localDate });
        } catch (error) {
            console.error('Error creating Markdown file:', error);
        }
    };

    return (
        <div className="col-md-12 offset-md-1">
            <Calendar
                onClickDay={handleClick}
                onChange={handleDateChange}
                value={selectedDate as Date}
                tileClassName={tileClassName}
            />
        </div>
    );
}
