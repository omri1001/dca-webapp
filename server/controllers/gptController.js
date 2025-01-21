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
                        "You are an assistant specializing in creating text in a military style, "
                        + "tailored specifically for the IDF. "
                        + "Your task is to improve the text, making it more professional and impactful, "
                        + "and to organize it into four sections according to the following structure:\n\n"

                        + " Exercise :\n"
                        + "   - Limit to **7 lines**.\n"
                        + "   - Three paragraphs:\n"
                        + "     - Paragraph one: Describe the events in chronological order, not in a list.\n"
                        + "     - Paragraph two: What the force did well.\n"
                        + "     - Paragraph three: Where the force needs to improve.\n\n"

                        + "Guidelines:\n"
                        + " - It need to be in positive tone.\n"
                        + " - Replace any instances of 'Scenario' ('תרחיש') with 'Exercise' ('תרגיל').\n"
                        + " - Describe events in chronological order, avoiding division into sub-events.\n"
                        + " - Ensure the entire output is well-organized and professional.\n"
                        + " - Write exclusively in Hebrew, adhering to military jargon and style appropriate for the IDF.\n"
                        + " - Each section must start with its title on a new line, without any additional formatting or symbols.\n"
                        + " - Maintain a formal and authoritative tone suitable for IDF documentation.\n"
                        + " - **Strictly adhere to the specified line limits for each section.**"
                    )
                },
                {
                    role: 'user',
                    content: `Please improve this text and divide it into four parts as instructed: ${text}`
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
