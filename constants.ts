import { 
  BookOpen, 
  Code, 
  PenTool, 
  Stethoscope, 
  TrendingUp, 
  Users, 
  Gavel, 
  Camera,
  Briefcase,
  Globe,
  Monitor
} from 'lucide-react';

export const INTEREST_OPTIONS = [
  { id: 'tech', label: 'Technology & Coding', icon: Code },
  { id: 'medical', label: 'Biology & Health', icon: Stethoscope },
  { id: 'art', label: 'Design & Arts', icon: PenTool },
  { id: 'biz', label: 'Business & Finance', icon: TrendingUp },
  { id: 'social', label: 'Helping People', icon: Users },
  { id: 'law', label: 'Law & Justice', icon: Gavel },
  { id: 'media', label: 'Media & Photography', icon: Camera },
  { id: 'research', label: 'Research & Reading', icon: BookOpen },
  { id: 'freelance', label: 'Freelancing', icon: Globe },
  { id: 'vocational', label: 'Technical Skills', icon: Monitor },
];

export const EDUCATION_LEVELS = [
  "Class 9-10 (Matric/O-Levels)",
  "Class 11-12 (Inter/A-Levels)",
  "Undergraduate (University)",
  "Graduated",
  "Diploma / Vocational"
];

export const MAJOR_SUBJECTS = [
  "Pre-Engineering",
  "Pre-Medical",
  "ICS (Computer Science)",
  "I.Com (Commerce)",
  "Arts / Humanities",
  "General Science",
  "Not Applicable / Other"
];

export const WORK_PREFERENCES = [
  "Office Job (Stable 9-5)",
  "Remote / Work from Home",
  "Freelancing (Be my own boss)",
  "Field Work / Outdoors",
  "Mixed / Hybrid"
];

export const CITIES_PAKISTAN = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad", "Other"
];

export const BUDGET_RANGES = [
  "Less than 50,000 PKR / Semester",
  "50,000 - 100,000 PKR / Semester",
  "100,000 - 200,000 PKR / Semester",
  "200,000+ PKR / Semester",
  "Scholarship / Financial Aid Needed"
];