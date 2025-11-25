
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, CareerResponse } from "../types";

// Initialize Gemini Client
// NOTE: For production, consider moving this to an environment variable.
const ai = new GoogleGenAI({ apiKey: "AIzaSyDrdKf9Rn6_JGQxC895cMVqaTge25auew8" });

export const generateCareerGuidance = async (data: AssessmentData): Promise<CareerResponse> => {
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
      7. Freelancing potential (Upwork/Fiverr demand) or remote work opportunities.
      8. Estimated entry-level monthly salary range in PKR.
      9. **Numeric Salary Data**: Provide 'salaryMin' and 'salaryMax' as numbers (e.g., 50000 and 80000) representing the monthly starting salary in PKR.
      10. **Market Demand Score**: A score from 0-100 representing the current job market demand/growth in Pakistan for this field.

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
                          items: { type: Type.STRING },
                          description: "Specific degree titles to apply for"
                        },
                        keySubjects: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Core subjects covered in the degree"
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
                  freelancePotential: { type: Type.STRING },
                  estimatedSalaryRangePKR: { type: Type.STRING },
                  salaryMin: { type: Type.NUMBER, description: "Minimum starting monthly salary in PKR (numeric)" },
                  salaryMax: { type: Type.NUMBER, description: "Maximum starting monthly salary in PKR (numeric)" },
                  marketDemand: { type: Type.NUMBER, description: "0-100 score representing market demand" }
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    return JSON.parse(response.text) as CareerResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
