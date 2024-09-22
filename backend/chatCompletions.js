
import 'dotenv/config'
import fs from 'fs/promises';
import fetch from 'node-fetch';
const corcelUrl = process.env.TEXT_URL;




async function loadPersona() {
    try {
        const data = await fs.readFile('./prompts.json', 'utf8');
        const personas = JSON.parse(data);
        return personas['dsa_prompt'];
    } catch (error) {
        console.error(`Error loading persona: ${error}`);
        return null;
    }
}



async function getCorcelResponse(apiKey, message, persona) {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: apiKey,
        },
        body: JSON.stringify({
            model: 'cortext-ultra',
            stream: false,
            top_p: 1,
            temperature: 0.0001,
            max_tokens: 4096,
            messages: [
                { role: 'system', content: persona.prompt },
                { role: 'user', content: message },
            ],
        }),
    };

    try {
        const res = await fetch(corcelUrl, options);
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Error occurred: ${error}`);
        return null;
    }
}


export { getCorcelResponse, loadPersona };