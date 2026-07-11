import { ResearchPaper, AnalyticsSummary, FunnelDataPoint, ScatterDataPoint, StackedBarDataPoint } from './types';

const API_BASE = '/api';

// Papers endpoints
export async function fetchPapers(): Promise<ResearchPaper[]> {
  const response = await fetch(`${API_BASE}/papers`);
  if (!response.ok) throw new Error('Failed to fetch papers');
  return response.json();
}

export async function fetchPaper(id: string): Promise<ResearchPaper> {
  const response = await fetch(`${API_BASE}/papers/${id}`);
  if (!response.ok) throw new Error('Failed to fetch paper');
  return response.json();
}

export async function createPaper(paper: Omit<ResearchPaper, 'id' | 'createdAt'>): Promise<ResearchPaper> {
  const response = await fetch(`${API_BASE}/papers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paper),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create paper');
  }
  return response.json();
}

export async function updatePaper(id: string, paper: Omit<ResearchPaper, 'id' | 'createdAt'>): Promise<ResearchPaper> {
  const response = await fetch(`${API_BASE}/papers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paper),
  });
  if (!response.ok) throw new Error('Failed to update paper');
  return response.json();
}

export async function deletePaper(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/papers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete paper');
}

// Analytics endpoints
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await fetch(`${API_BASE}/analytics/summary`);
  if (!response.ok) throw new Error('Failed to fetch analytics summary');
  return response.json();
}

export async function fetchFunnelData(): Promise<FunnelDataPoint[]> {
  const response = await fetch(`${API_BASE}/analytics/funnel`);
  if (!response.ok) throw new Error('Failed to fetch funnel data');
  return response.json();
}

export async function fetchScatterData(): Promise<ScatterDataPoint[]> {
  const response = await fetch(`${API_BASE}/analytics/scatter`);
  if (!response.ok) throw new Error('Failed to fetch scatter data');
  return response.json();
}

export async function fetchStackedBarData(): Promise<StackedBarDataPoint[]> {
  const response = await fetch(`${API_BASE}/analytics/stacked-bar`);
  if (!response.ok) throw new Error('Failed to fetch stacked bar data');
  return response.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
