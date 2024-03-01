'use client'
import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface MDEditorProps {
    url: string;
}

const MDEditorComponent: React.FC<MDEditorProps> = ({ url }) => {
    let savePath = url;

    const [value, setValue] = useState<string>('');
    const [pending, setPending] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentDate = new Date();
        let selectedDate = new Date(url.replace('/diary/', '').replace('.md', ''));
        selectedDate.setHours(0);

        if (!isNaN(selectedDate.getTime()) && selectedDate <= currentDate) {
            const fetchMarkdownFile = async () => {
                setPending(true);
                try {
                    const response = await axios.get(url);
                    setValue(response.data);
                } catch (error) {
                    console.error('Error fetching markdown file:', error);
                } finally {
                    setPending(false);
                }
            };

            fetchMarkdownFile();
        }
    }, [url]);

    const handleEditorChange = (value: string | undefined) => {
        setValue(value ?? '');
    };

    const handleSaveFile = async () => {
        try {
            await fetch('/api/saveMarkdownFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: value, filePath: savePath }),
            });
            console.log('File saved successfully');
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };


    const defaultContent = (value :string) => {
        return value === '' ? "还没有任何内容，别忘记了 / 读取中" : value ;
    }




    return (
        <div className="col-md-12">
            <h2>Diary Editor</h2>
            <MDEditor
                value={defaultContent(value)}
                style={{ height: '500px' }}
                onChange={handleEditorChange}
            />
            <div>
                <button className="btn btn-primary" onClick={handleSaveFile}>
                    Save
                </button>
                <h3>Diary Preview</h3>
                <div className="bg-light p-3" style={{ maxHeight: '55vh', overflowY: 'auto' }} ref={divRef}>
                    <MDEditor.Markdown source={defaultContent(value) || ''} />
                </div>
            </div>
        </div>
    );
};

export default MDEditorComponent;