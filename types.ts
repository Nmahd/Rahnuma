
export interface AssessmentData {
  name: string;
  city: string;
  educationLevel: string; // e.g., Matric, Intermediate, Bachelors
  majorSubjects: string; // e.g., Pre-Medical, ICS, Arts
  interests: string[]; // e.g., Technology, Art, Writing
  hobbies: string;
  workPreference: string; // e.g., Remote, Field, Office
  financialGoal: string; // e.g., Stability, High Risk/High Reward
  budgetRange: string; // e.g. < 50k, 50-100k, etc.
}

export interface University {
  name: string;
  city: string;
  sector: 'Public' | 'Private';
  website: string;
  feeRange: string;
}

export interface ShortCourse {
  name: string;
  provider: string;
  duration: string;
  cost: string;
  description?: string;
  link?: string;
}

export interface CareerRecommendation {
  title: string;
  matchScore: number; // 0-100
  description: string;
  roadmap: string[];
  universities: University[];
  shortCourses: ShortCourse[]; 
  freelancePotential: string;
  estimatedSalaryRangePKR: string;
}

export interface CareerResponse {
  analysis: string; // A brief summary of the user's profile
  recommendations: CareerRecommendation[];
}

export enum AppView {
  LANDING = 'LANDING',
  ASSESSMENT = 'ASSESSMENT',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
