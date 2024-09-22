import 'dotenv/config'
import fetch from 'node-fetch';

const url = process.env.IMG_URL;

export async function generateImage(apiKey, prompt) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey,
        },
        body: JSON.stringify({
            messages: prompt,
            model: 'cortext-image',
            size: '1024x1024',
            quality: 'standard',
            provider: 'OpenAI',
            steps: 30,
            cfg_scale: 8,
        }),
    };

    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        return null;
    }
}
