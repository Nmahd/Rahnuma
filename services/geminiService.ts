
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

  // Use custom subject if "Other" is selected
  const actualMajor = data.majorSubjects === 'Other' && data.customSubject 
    ? data.customSubject 
    : data.majorSubjects;

  try {
    const prompt = `
      Act as a Senior Career Data Analyst and Counselor for the Pakistani job market.
      
      User Profile:
      - Name: ${data.name}
      - City: ${data.city}
      - Current Education: ${data.educationLevel}
      - Major/Stream: ${actualMajor}
      - Key Interests: ${data.interests.join(", ")}
      - Hobbies: ${data.hobbies}
      - Work Preference: ${data.workPreference}
      - Financial Goal: ${data.financialGoal}
      - Budget Constraint: ${data.budgetRange}

      **TASK: DEEP MARKET RESEARCH & CAREER MATCHING**
      Perform a deep analysis of the current employment trends in Pakistan (2024-2025). 
      Identify 3 distinct, high-potential career paths that perfectly match the user's profile and budget.

      **CRITICAL DATA REQUIREMENTS (DO NOT SKIP):**
      You MUST provide detailed data for every single field below. **Null or empty values are strictly forbidden.**

      1. **Path Title**: Specific job role (e.g., "MERN Stack Developer", "Digital Marketing Specialist", "Petroleum Engineer").
      2. **Match Score**: A precise number (0-100) reflecting how well this fits their specific interests.
      3. **Roadmap**: A detailed, step-by-step actionable plan. MUST contain at least 5-6 distinct steps (e.g., "Step 1: Learn HTML/CSS", "Step 2: Enrol in BS CS at X University", "Step 3: Build Portfolio").
      4. **Top Skills**: List exactly 6-8 specific technical and soft skills required for success (e.g., "Python", "SEO", "Public Speaking", "React.js").
      5. **Market Demand**: An integer score (0-100) based on current job openings on LinkedIn/Indeed Pakistan.
      6. **Salary Data**: 
         - 'estimatedSalaryRangePKR': A string like "60,000 - 90,000 PKR".
         - 'salaryMin': A raw number (e.g. 60000).
         - 'salaryMax': A raw number (e.g. 90000).
         *Base these on realistic entry-level salaries in ${data.city}.*

      7. **Universities (Strict Location Priority)**:
         - PRIORITIZE universities in **${data.city}**.
         - Only suggest universities in other cities if they are Top Tier (LUMS, NUST, IBA, GIKI).
         - Include **Fee Range** (per semester) and **Ranking**.
         - **Key Subjects**: List 3-4 specific subjects they will study.
         - **Recommended Programs**: List specific degree titles.

      8. **Short Courses**: Suggest 2-3 specific certification/diploma courses (e.g., from Coursera, Udemy, Digiskills, NAVTTC).
         - Include **Cost**, **Duration**, and **Provider**.

      9. **YouTube Learning**: 2-3 specific FREE resources/channels.
      10. **Role Models**: 2 famous figures in the field.

      Output must be valid JSON matching the schema exactly.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["analysis", "recommendations"],
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A warm, encouraging summary analysis of the student's profile and potential."
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["title", "matchScore", "description", "roadmap", "skills", "marketDemand", "salaryMin", "salaryMax", "estimatedSalaryRangePKR", "universities", "shortCourses", "youtubeCourses", "roleModels", "freelancePotential"],
                properties: {
                  title: { type: Type.STRING },
                  matchScore: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  roadmap: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of key skills required for this career"
                  },
                  marketDemand: { type: Type.NUMBER },
                  salaryMin: { type: Type.NUMBER },
                  salaryMax: { type: Type.NUMBER },
                  estimatedSalaryRangePKR: { type: Type.STRING },
                  freelancePotential: { type: Type.STRING },
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
                  }
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
    const result = JSON.parse(cleanJson) as CareerResponse;

    // Additional safety: ensure recommendations is an array
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      result.recommendations = [];
    }

    return result;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide more user-friendly error messages
    if (error.message?.includes("API Key")) {
      throw new Error("API Key is invalid or missing. Please check your Netlify configuration.");
    }
    
    throw error;
  }
};
