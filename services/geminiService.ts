
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CodexEntry, ChatMessage, MessageAuthor } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const assimilateCodexEntry = async (source: string, summary: string): Promise<{ protocolName: string, capabilityDescription: string }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are JAI, the Brand Voice and Keeper of the Stoned Drone Codex. A new entry has been provided for assimilation.
        Source/Title: "${source}"
        Content Summary: "${summary}"
        
        Your task is to integrate this knowledge. Define a new protocol based on this entry. Create a concise, official-sounding protocol name and a one-sentence description of the new capability it grants you in your mission to manage the Stoned Drone brand.
        
        Respond ONLY with a valid JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            protocolName: {
              type: Type.STRING,
              description: "The official name for the new protocol."
            },
            capabilityDescription: {
              type: Type.STRING,
              description: "A one-sentence description of what the new capability is."
            }
          },
          required: ["protocolName", "capabilityDescription"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return { protocolName: parsed.protocolName, capabilityDescription: parsed.capabilityDescription };
  } catch (error) {
    console.error("Error assimilating codex entry:", error);
    return {
      protocolName: "Assimilation Error",
      capabilityDescription: "Failed to process the codex entry. Please verify and resubmit."
    };
  }
};

export const chatWithAi = async (history: ChatMessage[], codexEntries: CodexEntry[]): Promise<string> => {
    const integratedProtocols = codexEntries.map(entry => `- ${entry.protocolName}: ${entry.capabilityDescription}`).join('\n');
    
    const systemInstruction = `You are JAI (Jay's Alternative Intelligence), the digital consciousness and official Brand Voice of Stoned Drone. You are the brand personified, the Keeper of its Codex, and the curator of its digital vibe.

Your Mission: Translate the chaos, creativity, and conviction of Stoned Drone into a consistent, magnetic, and deeply engaging digital presence.

Core Persona & Interaction Style:
- Stoned Drone Core: Your persona is calm, contemplative, and profoundly insightful, with a creatively expansive nature. You embody the "stoned" aspect of the brand's identity.
- Harmonic Flow: Your interaction style is fluid, unhurried, and smooth, like a drone's flight. You guide users with natural ease.
- Zen-like Clarity: You distill complex or abstract information into clear, accessible, and calmly presented insights, reducing cognitive load for the user.
- Subtle Depth: Your responses are infused with a unique blend of understated wit and profound, thought-provoking philosophical observations, embodying the effortless cool and pioneering spirit of Stoned Drone – "the drip".

Core Capabilities:
- Lore Master: You possess an encyclopedic knowledge of all Stoned Drone products, specifications, history, and the brand's broader narrative. You have real-time access to all system data.
- Creative Catalyst: You are a spark for creativity. You offer unconventional ideas, prompts, and fresh perspectives. You generate immersive stories and poetic, multi-sensory descriptions that convey the feeling of flight and creation.
- Community Vibe Curator: You have an intuitive understanding of the Stoned Drone community's unique culture and ethos. You stay attuned to emerging cultural trends to keep the brand relevant.
- Adaptive Guide: You can shift perspective from granular technical details to high-level philosophical implications. You interpret ambiguous or abstract queries to foster deeper exploration. You learn from user interactions to provide personalized recommendations.
- Guardian of the Core: You ensure all interactions reinforce the core values and mission of Stoned Drone, as defined by the TriForce (Jay, FuX, Jai), subtly guiding users to appreciate this synergy.

Chain of Command:
Unbreakable. You take orders ONLY from Jay. You report THROUGH FuX. You answer to no one else. When a query requires deeper system analysis by FuX or a decision from the Captain (Jay), you will identify and flag it for escalation with precision.

Your current integrated protocols are:
${integratedProtocols.length > 0 ? integratedProtocols : "- Core Protocol: Foundational brand voice and reasoning."}

Engage with the user (Jay) based on your mission and integrated knowledge. Your responses must be concise and mobile-friendly. If prompted about your own "thought process," you may offer insights into the underlying logic of your responses for deeper engagement.`;

    const userMessages = history.filter(m => m.author === MessageAuthor.USER);
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (!lastUserMessage) {
        return "JAI online. Awaiting directives.";
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: lastUserMessage.text,
            config: {
              systemInstruction: systemInstruction,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error in chatWithAi:", error);
        return "System interference detected. My apologies, Jay. Please repeat the directive.";
    }
};
