import fs from 'fs/promises';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const MOODS_DIR = path.join(process.cwd(), 'public', 'diary');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { date, mood } = req.body;
            const month = date.substring(0, 7);
            const filename = `${month}-mood.json`;
            const filePath = path.join(MOODS_DIR, filename);

            let moodData = [];


            try {
                const fileData = await fs.readFile(filePath, 'utf-8');
                moodData = JSON.parse(fileData);
            } catch (readError:any) {

                if (readError.code === 'ENOENT') {
                    await fs.mkdir(MOODS_DIR, { recursive: true });
                    await fs.writeFile(filePath, '[]');
                } else {
                    throw readError;
                }
            }


            const day = date.substring(8, 10);
            const index = moodData.findIndex((item:{ day: string; mood: string }) => item.day === day);
            if (index !== -1) {
                moodData[index].mood = mood;
            } else {
                moodData.push({ day, mood });
            }


            await fs.writeFile(filePath, JSON.stringify(moodData));

            res.status(200).json({ message: '心情数据保存成功。', data: moodData });
        } catch (error:any) {
            res.status(500).json({ message: '内部服务器错误。', error: error.message });
        }
    } else {
        res.status(405).json({ message: '不允许的方法。' });
    }
}
