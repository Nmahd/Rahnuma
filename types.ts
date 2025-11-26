
export interface AssessmentData {
  name: string;
  city: string;
  educationLevel: string; // e.g., Matric, Intermediate, Bachelors
  majorSubjects: string; // e.g., Pre-Medical, ICS, Arts
  customSubject?: string; // For manual input if "Other" is selected
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
  ranking: string;
  recommendedPrograms: string[]; // e.g. "BS CS, BS SE"
  keySubjects: string[]; // e.g. "Programming Fundamentals, Calculus"
}

export interface ShortCourse {
  name: string;
  provider: string;
  duration: string;
  cost: string;
  description?: string;
  link?: string;
  format?: string; // e.g. Online, On-site
  level?: string; // e.g. Beginner, Advanced
}

export interface YoutubeResource {
  title: string;
  channelName: string;
  url: string;
}

export interface RoleModel {
  name: string;
  role: string;
  context: string; // Why they are famous
}

export interface CareerRecommendation {
  title: string;
  matchScore: number; // 0-100
  description: string;
  roadmap: string[];
  skills: string[]; // New field for specific skills
  universities: University[];
  shortCourses: ShortCourse[]; 
  youtubeCourses: YoutubeResource[];
  roleModels: RoleModel[];
  freelancePotential: string;
  estimatedSalaryRangePKR: string;
  salaryMin: number; // Numeric min for charts
  salaryMax: number; // Numeric max for charts
  marketDemand: number; // 0-100 Score for charts
}

export interface CareerResponse {
  analysis: string; // A brief summary of the user's profile
  recommendations: CareerRecommendation[];
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export enum AppView {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
