import { useEffect, useState, useCallback } from 'react';
import { fetchJobs, Job } from './api/jobs';
import AddJobForm from './components/AddJobForm';
import JobList from './components/JobList';

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const data = await fetchJobs();
    setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Job Tracker</h1>
      <p style={{ color: '#6b7280' }}>
        Paste a job description to automatically score it against your CV skills.
      </p>

      <AddJobForm onJobAdded={loadJobs} />

      <hr style={{ margin: '2rem 0' }} />

      <h2>Your tracked jobs ({jobs.length})</h2>
      {loading ? <p>Loading...</p> : <JobList jobs={jobs} onChange={loadJobs} />}
    </div>
  );
}
