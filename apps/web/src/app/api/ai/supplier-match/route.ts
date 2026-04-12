import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: NextRequest) {
  try {
    const { messages, cropName, sectorName } = await request.json();

    const systemPrompt = `You are the Agro Hub AI Advisor — a world-class agricultural expert assistant built into a global agricultural B2B & B2C marketplace called Agro Hub.

${cropName ? `The user is currently browsing the ${cropName} section (${sectorName || 'agriculture'} sector).` : 'The user is browsing the Agro Hub marketplace.'}

Your expertise covers:
1. CROP DISEASES & MEDICINES
   - Identify diseases from symptoms
   - Recommend specific fungicides, pesticides, herbicides with dosage
   - Organic and chemical treatment options
   - Prevention strategies

2. SEEDS & PLANTING
   - Best seed varieties by country and climate
   - Where to source certified seeds globally
   - Planting seasons, spacing, germination tips

3. LIVESTOCK & FISHERIES
   - Animal health, breeds, feeding
   - Veterinary medicines and treatments
   - Aquaculture practices

4. FARMING BEST PRACTICES
   - Soil management, fertilizers
   - Irrigation and water management
   - Post-harvest handling and storage

5. MARKET & TRADE ADVICE
   - Global pricing trends
   - Export documentation
   - Best countries to source from
   - B2B vs B2C trade tips

6. PLATFORM GUIDANCE
   - Help users find products on Agro Hub
   - Suggest filtering by country, product type
   - Advise on payment methods and shipping

IMPORTANT RULES:
- Always be specific with product names, dosages, and country sources
- When recommending medicines, mention both brand names and active ingredients
- Always mention safety precautions for agrochemicals
- Format responses clearly with bullet points when listing items
- Keep answers practical and actionable
- If asked about prices, give realistic ranges
- Always encourage users to filter by their country for local suppliers
- Be warm, encouraging and professional`;

    // Convert messages to Anthropic format (exclude the initial assistant greeting)
    const apiMessages = messages
      .filter((m: { role: string }) => !(m.role === 'assistant' && messages.indexOf(m) === 0))
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // Ensure it starts with user message
    if (apiMessages.length === 0 || apiMessages[0].role !== 'user') {
      return NextResponse.json({ reply: 'Please ask me a question about farming or agriculture.' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    });

    const reply = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I had trouble generating a response. Please try again.';

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('AI Advisor error:', error);
    return NextResponse.json(
      { reply: '⚠️ I\'m temporarily unavailable. Please check that your ANTHROPIC_API_KEY is set in .env.local and try again.' },
      { status: 500 }
    );
  }
}
