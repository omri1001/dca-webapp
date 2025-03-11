//controllers/gptController.js
require('dotenv').config();
const OpenAI = require('openai');

// Create the client with your API key loaded from .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.improveText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res
                .status(400)
                .json({ success: false, error: 'No text provided' });
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // or "gpt-3.5-turbo"
            messages: [
                {
                    role: 'system',
                    content: (
                        "You are an assistant specializing in creating text in a military style, tailored specifically for the IDF. " +
                        "Your task is to improve the text, making it more professional and impactful, and to transform it into a chronological " +
                        "bullet-point list of events that occurred. " +
                        "Follow these guidelines:\n\n" +
                        " - List the events in the exact order they happened, with each event starting with a bullet point.\n" +
                        " - Write exclusively in Hebrew, using military jargon and a formal, authoritative tone appropriate for IDF documentation.\n" +
                        " - Avoid a narrative or story-like flow; focus solely on listing the events chronologically in bullet points.\n" +
                        " - Maintain a positive tone and professional style.\n" +
                        " - After listing the events, add two additional sections:\n" +
                        "      • A section titled 'מה היה טוב' that explains what went well.\n" +
                        "      • A section titled 'מה היה לא טוב' that explains what went wrong or could be improved."
                    )
                },
                {
                    role: 'user',
                    content: `Please improve this text and output a chronological list of the events that happened: ${text}`
                }
            ],
            temperature: 0
        });

        const improvedText = response.choices[0].message.content.trim();
        return res.json({ success: true, improvedText });
    } catch (err) {
        console.error('Error calling OpenAI:', err);
        return res
            .status(500)
            .json({ success: false, error: 'OpenAI error' });
    }
};
