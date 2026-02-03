// Mock data for Advanced Report Dashboard

export interface OverviewStat {
  label: string
  value: string
  unit: string
  icon: string
}

export interface DepartmentData {
  name: string
  value: number
  color: string
}

export interface JobRoleData {
  rank: number
  role: string
  attrition: number
  color: string
}

export interface DemographicsData {
  name: string
  value: number
  color?: string
}

export interface AgeGroupData {
  range: string
  count: number
  color: string
}

export interface EducationData {
  degree: string
  count: number
  color: string
}

export interface AttritionTrendData {
  month: string
  attrition: number
  color: string
}

export interface SurveyScoreData {
  category: string
  score1: number
  score2: number
  score3: number
  score4: number
}

export interface EmployeeAttritionRecord {
  empId: string
  name: string
  department: string
  role: string
  attritionDate: string
  score: number
  salary: number
}

// Overview Statistics
export const overviewStats: OverviewStat[] = [
  {
    label: "Attrition Rate",
    value: "16.1",
    unit: "%",
    icon: "📊"
  },
  {
    label: "Total Attrition",
    value: "237",
    unit: "employees",
    icon: "👥"
  },
  {
    label: "Current Employees",
    value: "1,233",
    unit: "employees",
    icon: "💼"
  }
]

// Department-wise Attrition Data
export const departmentData: DepartmentData[] = [
  { name: "Sales", value: 354, color: "#F5A962" },
  { name: "R&D", value: 150, color: "#E8955E" },
  { name: "HR", value: 51, color: "#D17E4E" }
]

// Top 5 Job Roles with Attrition
export const jobRolesData: JobRoleData[] = [
  { rank: 1, role: "Laboratory Technician", attrition: 197, color: "#F5A962" },
  { rank: 2, role: "Sales Executive", attrition: 269, color: "#F5A962" },
  { rank: 3, role: "Research Scientist", attrition: 245, color: "#333333" },
  { rank: 4, role: "Sales Representative", attrition: 50, color: "#F5A962" },
  { rank: 5, role: "Human Resources", attrition: 40, color: "#F5A962" }
]

// Gender Demographics
export const genderData: DemographicsData[] = [
  { name: "Male", value: 732, color: "#F5A962" },
  { name: "Female", value: 501, color: "#B8B8B8" }
]

// Age Group Demographics
export const ageGroupData: AgeGroupData[] = [
  { range: "< 25", count: 59, color: "#F5A962" },
  { range: "25-34", count: 442, color: "#333333" },
  { range: "35-44", count: 454, color: "#333333" },
  { range: "45-55", count: 239, color: "#333333" },
  { range: "> 55", count: 39, color: "#B8B8B8" }
]

// Education Demographics
export const educationData: EducationData[] = [
  { degree: "Bachelor's Degree", count: 473, color: "#F5A962" },
  { degree: "Master's Degree", count: 340, color: "#E8955E" },
  { degree: "Associates Degree", count: 238, color: "#D17E4E" },
  { degree: "High School", count: 139, color: "#B8B8B8" },
  { degree: "Doctoral Degree", count: 43, color: "#999999" }
]

// Monthly Attrition Trend
export const attritionTrendData: AttritionTrendData[] = [
  { month: "May 2021", attrition: 2, color: "#F5A962" },
  { month: "Jul 2021", attrition: 5, color: "#F5A962" },
  { month: "Sep 2021", attrition: 8, color: "#F5A962" },
  { month: "Nov 2021", attrition: 12, color: "#F5A962" },
  { month: "Jan 2022", attrition: 18, color: "#F5A962" },
  { month: "Mar 2022", attrition: 28, color: "#F5A962" },
  { month: "May 2022", attrition: 42, color: "#F5A962" }
]

// Survey Scores Heatmap Data
export const surveyScoresData: SurveyScoreData[] = [
  { category: "Environment", score1: 212, score2: 43, score3: 62, score4: 60 },
  { category: "Job Satisfaction", score1: 187, score2: 244, score3: 393, score4: 318 },
  { category: "Job Involvement", score1: 58, score2: 71, score3: 125, score4: 13 },
  { category: "Relationship", score1: 57, score2: 45, score3: 71, score4: 64 },
  { category: "Work Life Balance", score1: 57, score2: 288, score3: 766, score4: 126 }
]

// Recent Attrition Records
export const recentAttritionRecords: EmployeeAttritionRecord[] = [
  {
    empId: "E_780",
    name: "Research Scientist",
    department: "R&D",
    role: "Research Scientist",
    attritionDate: "8 May 2023",
    score: 3.2,
    salary: 52686
  },
  {
    empId: "E_45",
    name: "Research Scientist",
    department: "R&D",
    role: "Research Scientist",
    attritionDate: "6 May 2023",
    score: 2.4,
    salary: 52293
  },
  {
    empId: "E_896",
    name: "Sales Representative",
    department: "Sales",
    role: "Sales Representative",
    attritionDate: "5 May 2023",
    score: 2.6,
    salary: 52800
  }
]
