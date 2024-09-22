import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { loadPersona, getCorcelResponse } from './chatCompletions.js';
import { generateImage } from './imageGeneration.js';


const app = express();


const port = process.env.PORT;

app.use(cors()); 
app.use(express.json());

const apiKey = process.env.APIKEY;

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Received message: ${message}`);

    const persona = await loadPersona();
    if (!persona) {
        return res.status(500).json({ error: 'Failed to load persona' });
    }

    const corcelResponse = await getCorcelResponse(apiKey, message, persona);

    if (corcelResponse && corcelResponse.length > 0) {
        const content = corcelResponse[0]?.choices[0]?.delta?.content;
        if (content) {
            console.log('Sending content back to client...');
            return res.json({ content });
        }
    }
    
    return res.status(500).json({ error: 'Failed to get a valid response from Corcel API' });
});


app.post('/api/image', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Received image generation request: ${prompt}`);

    const imageResponse = await generateImage(apiKey, prompt);



    if (imageResponse) {
        const imageUrl = imageResponse[0]?.image_url;
        

        console.log('Sending image generation response back to client...');
        return res.json({imageUrl});
    } else {
        return res.status(500).json({ error: 'Failed to generate image from Corcel API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
