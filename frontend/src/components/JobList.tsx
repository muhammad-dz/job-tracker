import { Job, updateStatus, removeJob } from '../api/jobs';

interface Props {
  jobs: Job[];
  onChange: () => void;
}

function scoreColor(score: number): string {
  if (score >= 65) return '#166534'; // green
  if (score >= 40) return '#92400e'; // amber
  return '#991b1b'; // red
}

function scoreBg(score: number): string {
  if (score >= 65) return '#dcfce7';
  if (score >= 40) return '#fef3c7';
  return '#fee2e2';
}

export default function JobList({ jobs, onChange }: Props) {
  async function handleStatusChange(id: number, status: string) {
    await updateStatus(id, status);
    onChange();
  }

  async function handleDelete(id: number) {
    await removeJob(id);
    onChange();
  }

  if (jobs.length === 0) {
    return <p>No jobs added yet — use the form to add your first one.</p>;
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0 }}>{job.title}</h3>
              <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>
                {job.company} {job.location ? `· ${job.location}` : ''}
              </p>
            </div>
            <div
              style={{
                background: scoreBg(job.match_score),
                color: scoreColor(job.match_score),
                fontWeight: 700,
                borderRadius: 6,
                padding: '0.25rem 0.75rem',
                height: 'fit-content',
              }}
            >
              {job.match_score}%
            </div>
          </div>

          <p style={{ fontSize: '0.85rem' }}>
            <strong>Matched:</strong> {job.matched_skills.join(', ') || 'none'}
          </p>
          <p style={{ fontSize: '0.85rem' }}>
            <strong>Missing:</strong> {job.missing_skills.join(', ') || 'none'}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(job.id, e.target.value)}
            >
              <option value="not_applied">Not applied</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
            {job.job_url && (
              <a href={job.job_url} target="_blank" rel="noreferrer">
                View posting
              </a>
            )}
            <button onClick={() => handleDelete(job.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
