export interface Job {
  id: number;
  title: string;
  company: string;
  location: string | null;
  job_url: string | null;
  description: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  status: string;
  date_added: string;
}

export interface NewJobPayload {
  title: string;
  company: string;
  location?: string;
  job_url?: string;
  description: string;
}

const API_BASE = '/api/jobs';

export async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function addJob(payload: NewJobPayload): Promise<void> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to add job');
}

export async function updateStatus(id: number, status: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
}

export async function removeJob(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete job');
}
