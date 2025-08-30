const axios = require('axios');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }
    try {
        const { prompt } = JSON.parse(event.body);
        if (!prompt) {
            return { statusCode: 400, body: JSON.stringify({ message: 'No prompt provided.' }) };
        }
        const openaiApiKey = process.env.OPENAI_API_KEY;
        if (!openaiApiKey) {
            return { statusCode: 500, body: JSON.stringify({ message: 'OpenAI API key not configured' }) };
        }
        const openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
        const openaiBody = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente experto en estrategia de marca, storytelling y análisis de comunicación digital. Estás integrado en el informe interactivo de la IA Maia Kode. Tus respuestas deben ser insightful, estructuradas en Markdown y directamente aplicables."
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            temperature: 0.7,
            max_tokens: 600,
        };
        const response = await axios.post(openaiApiUrl, openaiBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || 'An unexpected error occurred.';
        const errorStatus = error.response ? error.response.status : 500;
        return {
            statusCode: errorStatus,
            body: JSON.stringify({ message: errorMessage }),
        };
    }
};