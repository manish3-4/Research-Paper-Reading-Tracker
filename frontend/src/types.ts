export interface ResearchPaper {
  id: string;
  title: string;
  firstAuthor: string;
  domain: 'Computer Science' | 'Biology' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Social Sciences';
  readingStage: 'Abstract Read' | 'Introduction Done' | 'Methodology Done' | 'Results Analyzed' | 'Fully Read' | 'Notes Completed';
  citationCount: number;
  impactScore: 'High Impact' | 'Medium Impact' | 'Low Impact' | 'Unknown';
  dateAdded: string;
  createdAt?: string;
}

export interface AnalyticsSummary {
  totalCount: number;
  stageBreakdown: Array<{ readingStage: string; count: number }>;
  avgCitationsByDomain: Array<{ domain: string; avgCitations: number; paperCount: number }>;
  completionRate: number;
  fullyReadCount: number;
}

export interface FunnelDataPoint {
  stage: string;
  count: number;
}

export interface ScatterDataPoint {
  id: string;
  title: string;
  citationCount: number;
  impactScore: string;
  domain: string;
}

export interface StackedBarDataPoint {
  domain: string;
  [key: string]: string | number;
}
