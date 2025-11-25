import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, CareerResponse } from "../types";

// Helper to safely get the API key from different environment configurations
const getApiKey = () => {
  // 1. Try Vite standard (starts with VITE_)
  // @ts-ignore - import.meta is a valid property in modern bundlers
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Try Standard process.env (Node/CRA/Next.js) - fallback
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY || process.env.REACT_APP_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
  }
  
  return '';
};

// Clean JSON string if it contains Markdown code blocks
const cleanJsonString = (text: string) => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

export const generateCareerGuidance = async (data: AssessmentData): Promise<CareerResponse> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Configuration Error: API Key is missing. Please ensure 'VITE_API_KEY' is set in your Netlify environment variables and trigger a new deploy.");
  }

  // Initialize Gemini Client
  const ai = new GoogleGenAI({ apiKey: apiKey });

  try {
    const prompt = `
      Act as an expert career counselor for a student in Pakistan.
      
      User Profile:
      - Name: ${data.name}
      - City: ${data.city}
      - Current Education: ${data.educationLevel}
      - Major/Stream: ${data.majorSubjects}
      - Key Interests: ${data.interests.join(", ")}
      - Hobbies: ${data.hobbies}
      - Work Preference: ${data.workPreference}
      - Financial Goal: ${data.financialGoal}
      - Budget Constraint: ${data.budgetRange}

      Task:
      Based on this profile and their budget, suggest 3 distinct career paths.
      
      IMPORTANT:
      When suggesting universities, YOU MUST PRIORITIZE universities located in **${data.city}**. 
      If there are good universities for the career path in ${data.city}, list them first. 
      Only suggest universities in other cities if they are significantly better (e.g. LUMS, NUST, GIKI) or if options in ${data.city} are limited.
      
      For each path, provide:
      1. A relevant title.
      2. A match score (0-100) based on their interests.
      3. A description of why this fits.
      4. A step-by-step roadmap (education + skills) suitable for the Pakistani context.
      5. Top universities in Pakistan fitting the budget. Must include:
         - Name (e.g., NUST, LUMS, UET, IBA).
         - City.
         - Sector (Public/Private).
         - Official Website URL (ensure it is correct or provide the main domain).
         - Approximate Fee Range (per semester in PKR). Make sure this fits the user's budget constraint if possible.
         - Approximate Ranking or Tier (e.g., "Top 5 in Pakistan", "Tier 1", "Best for CS in ${data.city}").
         - Recommended Programs: List 2-3 specific degree titles they should apply for (e.g., "BS Software Engineering", "BBA").
         - Key Subjects: A brief list of 3-5 core subjects they will study (e.g., "Programming, Calculus, Algorithms").
      6. Specific short courses or vocational training (e.g., Digiskills, NAVTTC, Coursera, Udemy). Must include:
         - Course Name.
         - Provider/Platform.
         - Duration.
         - Cost (e.g., "Free", "Free (Digiskills)", "~5000 PKR", etc).
         - Brief Description (one sentence on what they will learn).
         - Link (URL to the course or provider home page).
         - Format (Online / On-site / Hybrid).
         - Difficulty Level (Beginner / Intermediate / Advanced).
      7. **Free YouTube Learning**: Suggest 2-3 specific FREE courses or playlists on YouTube.
         - Title of the series/playlist.
         - Channel Name (e.g., "CodeWithHarry", "GFXMentor", "Azad Chaiwala").
         - URL (link to the channel or playlist).
      8. **Inspiration & Role Models**: Suggest 2 famous personalities (Pakistani or Global) in this field.
         - Name.
         - Role/Title (e.g., "CEO of Netsol", "Founder of Tesla").
         - Context (1 sentence on why they are a role model for this specific career).
      9. Freelancing potential (Upwork/Fiverr demand) or remote work opportunities.
      10. Estimated entry-level monthly salary range in PKR.
      11. **Numeric Salary Data**: Provide 'salaryMin' and 'salaryMax' as numbers (e.g., 50000 and 80000).
      12. **Market Demand Score**: A score from 0-100.

      Also provide a short overall analysis of the profile.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A warm, encouraging summary analysis of the student's profile and potential."
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  roadmap: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  universities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        city: { type: Type.STRING },
                        sector: { type: Type.STRING, enum: ["Public", "Private"] },
                        website: { type: Type.STRING },
                        feeRange: { type: Type.STRING },
                        ranking: { type: Type.STRING },
                        recommendedPrograms: { 
                          type: Type.ARRAY, 
                          items: { type: Type.STRING }
                        },
                        keySubjects: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                      }
                    }
                  },
                  shortCourses: {
                    type: Type.ARRAY,
                    items: { 
                      type: Type.OBJECT, 
                      properties: {
                        name: { type: Type.STRING },
                        provider: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        cost: { type: Type.STRING },
                        description: { type: Type.STRING },
                        link: { type: Type.STRING },
                        format: { type: Type.STRING },
                        level: { type: Type.STRING }
                      }
                    }
                  },
                  youtubeCourses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        channelName: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  },
                  roleModels: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        context: { type: Type.STRING }
                      }
                    }
                  },
                  freelancePotential: { type: Type.STRING },
                  estimatedSalaryRangePKR: { type: Type.STRING },
                  salaryMin: { type: Type.NUMBER },
                  salaryMax: { type: Type.NUMBER },
                  marketDemand: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response generated from AI.");
    }

    const cleanJson = cleanJsonString(response.text);
    return JSON.parse(cleanJson) as CareerResponse;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide more user-friendly error messages
    if (error.message?.includes("API Key")) {
      throw new Error("API Key is invalid or missing. Please check your Netlify configuration.");
    }
    
    throw error;
  }
};