
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
    "Arts / Humanities",
    "Technical Group",
    "Other"
  ],
  "Class 11-12 (Inter/A-Levels)": [
    "Pre-Engineering",
    "Pre-Medical",
    "ICS (Computer Science)",
    "I.Com (Commerce)",
    "FA (Arts / Humanities)",
    "FA (General Science)",
    "A-Levels (Science)",
    "A-Levels (Business/Humanities)",
    "Other"
  ],
  "Undergraduate (University)": [
    "Computer Science (CS) / SE / IT",
    "Artificial Intelligence / Data Science",
    "Electrical / Electronics Engineering",
    "Mechanical / Mechatronics Engineering",
    "Civil / Urban Engineering",
    "Chemical / Materials Engineering",
    "Medical (MBBS / BDS)",
    "Pharmacy (Pharm-D)",
    "Physiotherapy (DPT) / Allied Health",
    "Business Admin (BBA) / Management",
    "Accounting & Finance (BS / CA / ACCA)",
    "Economics",
    "Psychology / Sociology",
    "International Relations (IR) / Pol Science",
    "Mass Communication / Media Studies",
    "Law (LLB)",
    "Fine Arts / Textile Design / Architecture",
    "English Literature / Linguistics",
    "Agriculture / Food Science",
    "Biotechnology / Microbiology",
    "Environmental Science",
    "Mathematics / Statistics / Physics",
    "Other"
  ],
  "Graduated": [
    "Computer Science / AI / Cyber Security",
    "Engineering (Electrical/Mech/Civil)",
    "Business Administration (MBA)",
    "Project Management",
    "Marketing / Digital Marketing",
    "Finance / Fintech",
    "Human Resource Management (HRM)",
    "Supply Chain Management",
    "Medical / Public Health",
    "Education / Teaching",
    "English / Applied Linguistics",
    "International Relations / Diplomacy",
    "Psychology (Clinical/Org)",
    "Data Science / Analytics",
    "Agriculture / Agribusiness",
    "Law (LLM)",
    "Natural Sciences (Bio/Chem/Phy)",
    "Other"
  ],
  "Diploma / Vocational": [
    "DAE (Civil)",
    "DAE (Electrical)",
    "DAE (Mechanical)",
    "DAE (Electronics)",
    "Information Technology (CIT)",
    "Web Development / Graphics",
    "Fashion / Textile Design",
    "Culinary Arts / Hotel Management",
    "Auto Mechanic / HVAC",
    "Electrician / Plumbing",
    "Beautician / Cosmetology",
    "Other"
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
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad", "Gujranwala", "Abbottabad", "Sargodha", "Bahawalpur", "Other"
];

export const BUDGET_RANGES = [
  "Less than 50,000 PKR / Semester",
  "50,000 - 100,000 PKR / Semester",
  "100,000 - 200,000 PKR / Semester",
  "200,000+ PKR / Semester",
  "Scholarship / Financial Aid Needed"
];
