
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

// Mapped subjects based on education level
export const SUBJECT_OPTIONS: Record<string, string[]> = {
  "Class 9-10 (Matric/O-Levels)": [
    "Science (Biology)",
    "Science (Computer Science)",
    "Arts / Humanities"
  ],
  "Class 11-12 (Inter/A-Levels)": [
    "Pre-Engineering",
    "Pre-Medical",
    "ICS (Computer Science)",
    "I.Com (Commerce)",
    "FA (Arts / Humanities)"
  ],
  "Undergraduate (University)": [
    "Electrical Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Computer Science (CS)",
    "Software Engineering",
    "Artificial Intelligence",
    "Medical (MBBS/BDS)",
    "Business Administration (BBA)",
    "Accounting & Finance",
    "Social Sciences / Psychology",
    "Law (LLB)",
    "Fine Arts / Design"
  ],
  "Graduated": [
    "Electrical / Electronics Engineering",
    "Mechanical / Civil Engineering",
    "Computer Science / IT",
    "Data Science / AI",
    "Business / MBA",
    "Medical / Health Sciences",
    "Social Sciences",
    "English / Literature",
    "Pure Sciences (Physics, Chem, Bio)"
  ],
  "Diploma / Vocational": [
    "DAE (Civil)",
    "DAE (Electrical)",
    "DAE (Mechanical)",
    "Information Technology",
    "Fashion Design",
    "Graphic Design",
    "Culinary Arts"
  ]
};

export const WORK_PREFERENCES = [
  "Office Job (Stable 9-5)",
  "Remote / Work from Home",
  "Freelancing (Be my own boss)",
  "Field Work / Outdoors",
  "Mixed / Hybrid"
];

export const CITIES_PAKISTAN = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad", "Gujranwala", "Abbottabad", "Other"
];

export const BUDGET_RANGES = [
  "Less than 50,000 PKR / Semester",
  "50,000 - 100,000 PKR / Semester",
  "100,000 - 200,000 PKR / Semester",
  "200,000+ PKR / Semester",
  "Scholarship / Financial Aid Needed"
];
