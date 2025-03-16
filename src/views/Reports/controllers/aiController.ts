import axios from 'axios';

export async function improveText(text: string): Promise<string> {
    try {
        const response = await axios.post('http://localhost:3001/api/ai-improve-text', {
            text
        });
        // The server returns { success: true, improvedText: "..." }
        return response.data.improvedText;
    } catch (error: any) {
        console.error('Error calling AI API:', error);
        // You might want to handle the error more gracefully in real code.
        // For now, just rethrow or return the original text if an error occurs.
        throw new Error(error?.response?.data?.error || 'AI error');
    }
}

export async function summarizeText(text: string): Promise<string> {
    try {
        const response = await axios.post('http://localhost:3001/api/ai-summarize-text', {
            text
        });
        // The server returns { success: true, summary: "..." }
        return response.data.summary;
    } catch (error: any) {
        console.error('Error calling AI API for summarization:', error);
        throw new Error(error?.response?.data?.error || 'AI summarization error');
    }
}
