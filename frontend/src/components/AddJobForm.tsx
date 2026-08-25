import { useState, FormEvent } from 'react';
import { addJob } from '../api/jobs';

interface Props {
  onJobAdded: () => void;
}

export default function AddJobForm({ onJobAdded }: Props) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !company || !description) {
      setError('Title, company and description are required.');
      return;
    }

    setSubmitting(true);
    try {
      await addJob({ title, company, location, job_url: jobUrl, description });
      setTitle('');
      setCompany('');
      setLocation('');
      setJobUrl('');
      setDescription('');
      onJobAdded();
    } catch (err) {
      setError('Something went wrong adding this job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <h2>Add a job posting</h2>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <input
        placeholder="Job title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        placeholder="Job posting URL (optional)"
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
      />
      <textarea
        placeholder="Paste the full job description here"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={8}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Scoring...' : 'Add & Score Job'}
      </button>
    </form>
  );
}
