export interface Category {
  id: string
  name: string
  subcategories: SubCategory[]
}

export interface SubCategory {
  id: string
  name: string
  categoryId: string
}

export interface Course {
  id: string
  name: string
  category: string
  subcategory: string
  description: string
  status: 'Draft' | 'Published'
  rating: number
  totalQuestions: number
  totalMarks: number
  createdAt: string
}

export interface QuestionGroup {
  id: string
  courseId: string
  name: string
  description?: string
  order: number
  questions: Question[]
}

export interface Question {
  id: string
  groupId: string
  title: string
  description?: string
  answerType: 'text' | 'multipleChoice' | 'yesNo'
  options?: string[]
  marks: number
  rating: number
  order: number
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  duration?: number
  mediaItems: MediaItem[]
  quizzes: ModuleQuiz[]
}

export interface MediaItem {
  id: string
  moduleId: string
  type: 'image' | 'pdf' | 'video'
  title: string
  fileName: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string
  duration?: number
  uploadedAt: string
}

export interface ModuleQuiz {
  id: string
  moduleId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  passingScore: number
  timeLimit?: number
}

export interface QuizQuestion {
  id: string
  quizId: string
  title: string
  answerType: 'text' | 'multipleChoice' | 'yesNo'
  options?: string[]
  correctAnswer: string | string[]
  marks: number
  order: number
}

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Technical Skills',
    subcategories: [
      { id: 'subcat-1', name: 'HVAC Systems', categoryId: 'cat-1' },
      { id: 'subcat-2', name: 'Electrical', categoryId: 'cat-1' },
      { id: 'subcat-3', name: 'Plumbing', categoryId: 'cat-1' },
      { id: 'subcat-4', name: 'Automation', categoryId: 'cat-1' },
    ],
  },
  {
    id: 'cat-2',
    name: 'Customer Service',
    subcategories: [
      { id: 'subcat-5', name: 'Communication', categoryId: 'cat-2' },
      { id: 'subcat-6', name: 'Problem Solving', categoryId: 'cat-2' },
      { id: 'subcat-7', name: 'Compliance', categoryId: 'cat-2' },
    ],
  },
  {
    id: 'cat-3',
    name: 'Safety & Compliance',
    subcategories: [
      { id: 'subcat-8', name: 'Safety Protocols', categoryId: 'cat-3' },
      { id: 'subcat-9', name: 'Legal Requirements', categoryId: 'cat-3' },
      { id: 'subcat-10', name: 'Equipment Certification', categoryId: 'cat-3' },
    ],
  },
  {
    id: 'cat-4',
    name: 'Business Skills',
    subcategories: [
      { id: 'subcat-11', name: 'Sales Techniques', categoryId: 'cat-4' },
      { id: 'subcat-12', name: 'Leadership', categoryId: 'cat-4' },
      { id: 'subcat-13', name: 'Management', categoryId: 'cat-4' },
    ],
  },
]

export const mockCourses: Course[] = [
  {
    id: '001',
    name: 'HVAC System Fundamentals',
    category: 'Technical Skills',
    subcategory: 'HVAC Systems',
    description: 'Learn the basics of HVAC systems installation and maintenance.',
    status: 'Published',
    rating: 4.5,
    totalQuestions: 25,
    totalMarks: 100,
    createdAt: '2025-12-15',
  },
  {
    id: '002',
    name: 'Advanced Electrical Troubleshooting',
    category: 'Technical Skills',
    subcategory: 'Electrical',
    description: 'Master advanced techniques for electrical system diagnostics.',
    status: 'Published',
    rating: 4.8,
    totalQuestions: 30,
    totalMarks: 120,
    createdAt: '2025-12-10',
  },
  {
    id: '003',
    name: 'Customer Service Excellence',
    category: 'Customer Service',
    subcategory: 'Communication',
    description: 'Develop excellent customer service and communication skills.',
    status: 'Draft',
    rating: 0,
    totalQuestions: 15,
    totalMarks: 60,
    createdAt: '2026-01-05',
  },
  {
    id: 'course-4',
    name: 'Safety Protocols & Compliance',
    category: 'Safety & Compliance',
    subcategory: 'Safety Protocols',
    description: 'Comprehensive overview of safety protocols and compliance requirements.',
    status: 'Published',
    rating: 4.2,
    totalQuestions: 20,
    totalMarks: 80,
    createdAt: '2025-11-20',
  },
  {
    id: 'course-5',
    name: 'Plumbing Best Practices',
    category: 'Technical Skills',
    subcategory: 'Plumbing',
    description: 'Industry best practices for plumbing installations and repairs.',
    status: 'Draft',
    rating: 0,
    totalQuestions: 18,
    totalMarks: 90,
    createdAt: '2026-01-12',
  },
  {
    id: 'course-6',
    name: 'Sales Techniques & Closing Deals',
    category: 'Business Skills',
    subcategory: 'Sales Techniques',
    description: 'Learn proven sales techniques and strategies to close more deals.',
    status: 'Published',
    rating: 4.7,
    totalQuestions: 22,
    totalMarks: 100,
    createdAt: '2025-12-01',
  },
]

export const mockQuestionGroups: QuestionGroup[] = [
  {
    id: 'group-1',
    courseId: 'course-1',
    name: 'Module 1: HVAC Basics',
    description: 'Introduction to HVAC systems',
    order: 1,
    questions: [
      {
        id: 'q-1',
        groupId: 'group-1',
        title: 'What does HVAC stand for?',
        answerType: 'text',
        marks: 5,
        rating: 4,
        order: 1,
      },
      {
        id: 'q-2',
        groupId: 'group-1',
        title: 'Which of the following is a component of HVAC?',
        answerType: 'multipleChoice',
        options: ['Compressor', 'Thermostat', 'Evaporator', 'All of the above'],
        marks: 10,
        rating: 5,
        order: 2,
      },
      {
        id: 'q-3',
        groupId: 'group-1',
        title: 'Is regular maintenance important for HVAC systems?',
        answerType: 'yesNo',
        marks: 5,
        rating: 5,
        order: 3,
      },
    ],
  },
  {
    id: 'group-2',
    courseId: 'course-1',
    name: 'Module 2: Installation Procedures',
    description: 'Step-by-step installation guide',
    order: 2,
    questions: [
      {
        id: 'q-4',
        groupId: 'group-2',
        title: 'Describe the proper installation sequence for an HVAC unit.',
        answerType: 'text',
        marks: 15,
        rating: 4,
        order: 1,
      },
      {
        id: 'q-5',
        groupId: 'group-2',
        title: 'What safety precautions should be taken?',
        answerType: 'text',
        marks: 10,
        rating: 5,
        order: 2,
      },
    ],
  },
]

export const mockModules: CourseModule[] = [
  {
    id: 'mod-1',
    courseId: '001',
    title: 'Module 1: HVAC System Basics',
    description: 'Introduction to HVAC systems, components, and how they work',
    order: 1,
    duration: 45,
    mediaItems: [
      {
        id: 'media-1',
        moduleId: 'mod-1',
        type: 'video',
        title: 'HVAC System Overview',
        fileName: 'hvac-overview.mp4',
        fileSize: 125.5,
        fileUrl: 'https://example.com/hvac-overview.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=HVAC+Overview',
        duration: 12,
        uploadedAt: '2026-01-15',
      },
      {
        id: 'media-2',
        moduleId: 'mod-1',
        type: 'pdf',
        title: 'HVAC Components Guide',
        fileName: 'hvac-components.pdf',
        fileSize: 2.4,
        fileUrl: 'https://example.com/hvac-components.pdf',
        uploadedAt: '2026-01-15',
      },
      {
        id: 'media-3',
        moduleId: 'mod-1',
        type: 'image',
        title: 'HVAC System Diagram',
        fileName: 'hvac-diagram.jpg',
        fileSize: 0.8,
        fileUrl: 'https://via.placeholder.com/600x400?text=HVAC+Diagram',
        uploadedAt: '2026-01-15',
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        moduleId: 'mod-1',
        title: 'HVAC Basics Quiz',
        description: 'Test your knowledge of HVAC system basics',
        passingScore: 70,
        timeLimit: 15,
        questions: [
          {
            id: 'qq-1',
            quizId: 'quiz-1',
            title: 'What does HVAC stand for?',
            answerType: 'multipleChoice',
            options: [
              'Heating, Ventilation, Air Conditioning',
              'High Voltage Alternating Current',
              'Heavy Vehicle Air Compression',
              'None of the above',
            ],
            correctAnswer: 'Heating, Ventilation, Air Conditioning',
            marks: 10,
            order: 1,
          },
          {
            id: 'qq-2',
            quizId: 'quiz-1',
            title: 'Is regular maintenance essential for HVAC systems?',
            answerType: 'yesNo',
            correctAnswer: 'yes',
            marks: 10,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'mod-2',
    courseId: '001',
    title: 'Module 2: Installation Procedures',
    description: 'Step-by-step guide for proper HVAC installation',
    order: 2,
    duration: 60,
    mediaItems: [
      {
        id: 'media-4',
        moduleId: 'mod-2',
        type: 'video',
        title: 'Step-by-Step Installation Guide',
        fileName: 'installation-guide.mp4',
        fileSize: 250.0,
        fileUrl: 'https://example.com/installation-guide.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Installation',
        duration: 28,
        uploadedAt: '2026-01-16',
      },
      {
        id: 'media-5',
        moduleId: 'mod-2',
        type: 'pdf',
        title: 'Installation Checklist',
        fileName: 'installation-checklist.pdf',
        fileSize: 1.2,
        fileUrl: 'https://example.com/installation-checklist.pdf',
        uploadedAt: '2026-01-16',
      },
    ],
    quizzes: [
      {
        id: 'quiz-2',
        moduleId: 'mod-2',
        title: 'Installation Procedures Quiz',
        description: 'Verify your understanding of proper installation steps',
        passingScore: 75,
        timeLimit: 20,
        questions: [
          {
            id: 'qq-3',
            quizId: 'quiz-2',
            title: 'What is the first step in HVAC installation?',
            answerType: 'text',
            correctAnswer: 'Site preparation and measurements',
            marks: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'mod-3',
    courseId: '001',
    title: 'Module 3: Maintenance & Troubleshooting',
    description: 'Learn maintenance schedules and common troubleshooting techniques',
    order: 3,
    duration: 50,
    mediaItems: [
      {
        id: 'media-6',
        moduleId: 'mod-3',
        type: 'video',
        title: 'Maintenance Best Practices',
        fileName: 'maintenance.mp4',
        fileSize: 180.0,
        fileUrl: 'https://example.com/maintenance.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x200?text=Maintenance',
        duration: 22,
        uploadedAt: '2026-01-17',
      },
      {
        id: 'media-7',
        moduleId: 'mod-3',
        type: 'pdf',
        title: 'Troubleshooting Guide',
        fileName: 'troubleshooting-guide.pdf',
        fileSize: 3.1,
        fileUrl: 'https://example.com/troubleshooting-guide.pdf',
        uploadedAt: '2026-01-17',
      },
    ],
    quizzes: [
      {
        id: 'quiz-3',
        moduleId: 'mod-3',
        title: 'Maintenance & Troubleshooting Quiz',
        description: 'Test your maintenance knowledge',
        passingScore: 70,
        timeLimit: 18,
        questions: [
          {
            id: 'qq-4',
            quizId: 'quiz-3',
            title: 'How often should HVAC filters be changed?',
            answerType: 'multipleChoice',
            options: [
              'Every month',
              'Every 3 months',
              'Every 6 months',
              'Every year',
            ],
            correctAnswer: 'Every 3 months',
            marks: 10,
            order: 1,
          },
        ],
      },
    ],
  },
]

export const mockMediaItems: MediaItem[] = [
  ...mockModules.flatMap((m) => m.mediaItems),
]
