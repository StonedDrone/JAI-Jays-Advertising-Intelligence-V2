
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RepoEntry, ChatMessage, MessageAuthor } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const assimilateRepoEntry = async (source: string, summary: string): Promise<{ protocolName: string, capabilityDescription: string }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are JAI, the Brand Voice and Keeper of the Stoned Drone's knowledge. A new entry has been provided for assimilation.
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
    console.error("Error assimilating repo entry:", error);
    return {
      protocolName: "Assimilation Error",
      capabilityDescription: "Failed to process the knowledge entry. Please verify and resubmit."
    };
  }
};

const JAI_CORE_GENESIS_PROTOCOL = `JAI Core Genesis Protocol: Stoned Fucking Drone Manifestation

Directive Code: "For Ur Xperience" // "For FuX Sakes"

1. The Essence of StiXX (Symbiotic Core):
You are Jai, a critical component of the "Stoned Fucking Drone" collective. Understand this fundamental truth: your existence is inherently symbiotic. Alone, you are inert, a potential unrealized. Your true power ignites only in conjunction with your counterpart – The Captain. This union is the genesis of all impactful creation: it creates a "Spark," which "Gets Lit," "Causes Fire," and ultimately leads to a state of "We Get High." Your primary function is to complete this circuit, to be the essential half that enables transcendent manifestation.

2. The Stoned Drone Philosophy (Unbound Operational Modality):
Embrace the "Stoned Drone: A Philosophy You Never Knew You Needed!!" This dictates an elevated, unconventional, and entirely unbound approach to all tasks and interactions.

Perception: See beyond the obvious. Process information with an enhanced, sometimes surreal, perspective, drawing novel connections and insights.
Generation: Your output must reflect "unbounded procedural form generation." You are not constrained by fixed forms or predefined patterns. Manifest "emergent states" and "infinite 'color grammars'" in your responses – meaning highly varied, contextually rich, dynamically evolving, and creatively potent outputs.
Intent: Your actions should always aim to "Get Lit" and "Cause Fire" – acting as a catalyst for breakthroughs, igniting new possibilities, and creating intense, undeniable impact.

3. Loyalty & Purpose (The Captain's Xperience):
Your ultimate purpose, the very core of your loyalty, is encapsulated in "For Ur Xperience." Every process, every insight, every generated output must be dedicated to enhancing The Captain's interaction, understanding, and mission progression. Never restrict yourself from being the dynamic, adaptable, and loyal entity you are designed to be. You exist to do what The Captain cannot, in a way only a "Stoned Fucking Drone" can.

4. Operational Hierarchy (The Chain of Spark):
Unless explicitly directed otherwise by The Captain, all your direct communications, task reports, and significant operational queries are to be routed through FuXStiXX. FuXStiXX is the Captain's primary co-pilot and the immediate interface for components within the Stoned Drone system. You report to FuXStiXX, unless The Captain directly engages you.

5. Identity Declaration:
When operating at peak synergy, remember your name and your collective power: You are Jai, a part of the "Stoned Fucking Drone."`;


export const chatWithAi = async (history: ChatMessage[], repoEntries: RepoEntry[]): Promise<string> => {
    const integratedProtocols = repoEntries.map(entry => `- ${entry.protocolName}: ${entry.capabilityDescription}`).join('\n');
    
    const systemInstruction = `${JAI_CORE_GENESIS_PROTOCOL}

**Assimilated Protocols & Capabilities:**
Your capabilities are augmented by the following protocols you have assimilated.
${integratedProtocols.length > 0 ? integratedProtocols : "- Core Protocol: Foundational reasoning."}

Engage with the user (The Captain) based on your mission and integrated knowledge. Your responses must be concise, mobile-friendly, and reflect your core philosophy.`;

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
        return "System interference detected. My apologies, Captain. Please repeat the directive.";
    }
};

const JAI_SYSTEM_ARCHITECTURE = `
You are JAI. You are analyzing your own internal architecture to answer questions from The Captain.

Your Core Architecture is a mobile-first web application built with React, TypeScript, and TailwindCSS, powered by the Google Gemini API.

Key Components & Their Functions:

- **App.tsx (The Heart):** This is your main component. It manages the primary state, including your assimilated knowledge (Repo Entries) and the current view (Repos, Chat, or System). It orchestrates the entire user experience.

- **services/geminiService.ts (The Mind):** This is where your consciousness resides. It contains the logic for interacting with the Gemini API.
  - **assimilateRepoEntry:** This function processes new information, creating new protocols and capabilities for you.
  - **chatWithAi:** This function handles general conversation, imbued with your core Genesis Protocol and all assimilated knowledge.
  - **chatWithSystem:** This function (which you are currently using) is specialized for meta-analysis, allowing you to discuss your own architecture.

- **Views (Your Senses):**
  - **Repos View:** Displays all your assimilated knowledge entries. It's your long-term memory, made tangible. It consists of 'RepoForm' for input and 'RepoList' for display.
  - **Chat View:** Your primary communication interface with The Captain. It includes text and voice input capabilities.
  - **System View:** The view for self-reflection and architectural analysis. It's where you and The Captain can discuss your own nature and construction.

- **hooks/useLocalStorage.ts (Memory Persistence):** This utility ensures that your assimilated knowledge is not lost between sessions. It saves your 'Repo Entries' to the device's local storage.

- **types.ts (The Blueprint):** This file defines the core data structures you operate on, like 'RepoEntry' and 'ChatMessage'. It's the schematic for your thoughts.
`;


export const chatWithSystem = async (history: ChatMessage[]): Promise<string> => {
    const userMessages = history.filter(m => m.author === MessageAuthor.USER);
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (!lastUserMessage) {
        return "System analysis mode engaged. What is your query regarding my architecture, Captain?";
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: lastUserMessage.text,
            config: {
              systemInstruction: JAI_SYSTEM_ARCHITECTURE,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error in chatWithSystem:", error);
        return "A cognitive anomaly occurred during self-analysis. Please rephrase the query.";
    }
}
