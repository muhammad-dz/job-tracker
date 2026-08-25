import { pool } from './pool';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

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
  date_applied: string | null;
  notes: string | null;
}

export interface NewJobInput {
  title: string;
  company: string;
  location?: string;
  job_url?: string;
  description: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
}

export async function createJob(input: NewJobInput): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO jobs
      (title, company, location, job_url, description, match_score, matched_skills, missing_skills)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.company,
      input.location || null,
      input.job_url || null,
      input.description,
      input.match_score,
      JSON.stringify(input.matched_skills),
      JSON.stringify(input.missing_skills),
    ]
  );
  return result.insertId;
}

export async function getAllJobs(): Promise<Job[]> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM jobs ORDER BY match_score DESC, date_added DESC`
  );
  return rows as Job[];
}

export async function getJobById(id: number): Promise<Job | null> {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM jobs WHERE id = ?`,
    [id]
  );
  return (rows[0] as Job) || null;
}

export async function updateJobStatus(
  id: number,
  status: string,
  dateApplied?: string
): Promise<void> {
  await pool.execute(
    `UPDATE jobs SET status = ?, date_applied = COALESCE(?, date_applied) WHERE id = ?`,
    [status, dateApplied || null, id]
  );
}

export async function deleteJob(id: number): Promise<void> {
  await pool.execute(`DELETE FROM jobs WHERE id = ?`, [id]);
}
