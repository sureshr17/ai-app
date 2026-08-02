import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client on server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1. Natural Language Search Endpoint
  app.post('/api/gemini/nl-search', async (req, res) => {
    try {
      const { query, items } = req.body;
      if (!query || !Array.isArray(items)) {
        res.status(400).json({ error: 'Query string and items array are required.' });
        return;
      }

      const prompt = `
You are an expert AI movie and book catalog search assistant.
The user submitted this natural language search request: "${query}"

Here is the current catalog database of media items:
${JSON.stringify(items.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        creator: item.creator,
        year: item.year,
        genre: item.genre,
        language: item.language,
        rating: item.rating,
        synopsis: item.synopsis
      })), null, 2)}

Task:
1. Filter or match the item IDs that best satisfy the user's search criteria (e.g. genre, language, minimum rating, themes, plot details).
2. Provide a clear, friendly 2-3 sentence AI reasoning explaining why these choices match the query.
3. Suggest active filter criteria if applicable (genre, language, minRating, type).

Return strictly JSON matching this structure:
{
  "matchedIds": ["m1", "b2"],
  "aiReasoning": "Explanation of matched items...",
  "suggestedFilters": {
    "genre": "Sci-Fi",
    "language": "English",
    "minRating": 4.0,
    "type": "movie"
  }
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              aiReasoning: { type: Type.STRING },
              suggestedFilters: {
                type: Type.OBJECT,
                properties: {
                  genre: { type: Type.STRING },
                  language: { type: Type.STRING },
                  minRating: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                },
              },
            },
            required: ['matchedIds', 'aiReasoning'],
          },
        },
      });

      const jsonStr = response.text || '{}';
      const result = JSON.parse(jsonStr);
      res.json(result);
    } catch (err: any) {
      console.error('NL Search API error:', err);
      res.status(500).json({ error: 'Failed to process natural language search', details: err?.message || String(err) });
    }
  });

  // 2. AI Recommendation Endpoint
  app.post('/api/gemini/recommendations', async (req, res) => {
    try {
      const { favorites, watchlist, catalog } = req.body;

      const prompt = `
You are a personalized movie & book recommendation AI engine.
User's Favorite Items:
${JSON.stringify(favorites, null, 2)}

User's Watchlist Items:
${JSON.stringify(watchlist, null, 2)}

Full Catalog of Available Items:
${JSON.stringify(catalog, null, 2)}

Task:
Analyze the user's taste in genres, creators, languages, and themes.
Select 3 to 5 catalog items that the user hasn't added to favorites yet, or explain why they fit.
For each recommended item, calculate a match percentage (e.g. 85-99%) and write a concise 1-2 sentence reason.
Also provide an overall 2-sentence user taste insight summary.

Return strictly JSON matching:
{
  "recommendations": [
    {
      "id": "m1",
      "title": "Inception",
      "type": "movie",
      "matchPercentage": 96,
      "aiReasoning": "Matches your preference for high-concept sci-fi thrillers."
    }
  ],
  "overallInsight": "You lean strongly towards immersive Sci-Fi and thought-provoking storytelling with deep worldbuilding."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    type: { type: Type.STRING },
                    matchPercentage: { type: Type.NUMBER },
                    aiReasoning: { type: Type.STRING },
                  },
                  required: ['id', 'title', 'type', 'matchPercentage', 'aiReasoning'],
                },
              },
              overallInsight: { type: Type.STRING },
            },
            required: ['recommendations', 'overallInsight'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (err: any) {
      console.error('Recommendations API error:', err);
      res.status(500).json({ error: 'Failed to generate recommendations', details: err?.message || String(err) });
    }
  });

  // 3. Summarize Reviews Endpoint
  app.post('/api/gemini/summarize-reviews', async (req, res) => {
    try {
      const { title, type, reviews, synopsis } = req.body;

      const prompt = `
You are a senior audience review critic AI.
Analyze the user reviews for the ${type || 'item'} titled "${title}".
Synopsis: "${synopsis || 'N/A'}"

User Reviews:
${JSON.stringify(reviews, null, 2)}

Task:
Synthesize the audience reviews into a structured review summary.
Determine the overall sentiment ('Highly Positive', 'Mostly Positive', 'Mixed Reviews', or 'Critical').
Provide a concise 2-sentence synthesis, 3 distinct pros (what viewers/readers praise most), 2-3 cons or considerations, target audience match, and an AI recommendation score out of 100.

Return strictly JSON matching:
{
  "overallSentiment": "Highly Positive",
  "summary": "Audience consensus highly praises the intricate narrative and captivating visuals...",
  "pros": ["Outstanding cinematography", "Masterful musical score", "Unpredictable plot twists"],
  "cons": ["Pacing can feel slow in the second act", "Requires high attention to detail"],
  "targetAudience": "Fans of psychological sci-fi and complex storytelling",
  "aiScore": 94
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSentiment: { type: Type.STRING },
              summary: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              targetAudience: { type: Type.STRING },
              aiScore: { type: Type.NUMBER },
            },
            required: ['overallSentiment', 'summary', 'pros', 'cons', 'targetAudience', 'aiScore'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (err: any) {
      console.error('Summarize Reviews API error:', err);
      res.status(500).json({ error: 'Failed to summarize reviews', details: err?.message || String(err) });
    }
  });

  // 4. Auto-generate Media Details for Admin Endpoint
  app.post('/api/gemini/generate-media', async (req, res) => {
    try {
      const { title, type, creator } = req.body;
      if (!title) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const prompt = `
You are an expert entertainment media archivist.
Generate detailed metadata for a ${type || 'movie'} titled "${title}"${creator ? ` by/directed by ${creator}` : ''}.

Task:
Generate:
1. An engaging 2-3 sentence synopsis.
2. 3 key highlights or features.
3. 2-4 appropriate genres.
4. Duration (e.g. "2h 15m") if movie, or Pages (e.g. "340 pages") if book.
5. A catchy 1-line marketing tagline.

Return strictly JSON matching:
{
  "synopsis": "Full synopsis text...",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "suggestedGenres": ["Sci-Fi", "Drama"],
  "durationOrPages": "2h 10m",
  "tagline": "Catchy tagline line..."
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              synopsis: { type: Type.STRING },
              highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedGenres: { type: Type.ARRAY, items: { type: Type.STRING } },
              durationOrPages: { type: Type.STRING },
              tagline: { type: Type.STRING },
            },
            required: ['synopsis', 'highlights', 'suggestedGenres', 'durationOrPages', 'tagline'],
          },
        },
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (err: any) {
      console.error('Generate Media Info error:', err);
      res.status(500).json({ error: 'Failed to generate media details', details: err?.message || String(err) });
    }
  });

  // Vite development middleware vs Static Production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
