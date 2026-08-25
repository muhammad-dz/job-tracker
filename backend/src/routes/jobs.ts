import { Router, Request, Response } from 'express';
import { scoreJobAgainstCv, DEFAULT_CV_SKILLS } from '../services/matchScorer';
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
} from '../db/jobsRepository';

const router = Router();

// POST /api/jobs — add a new job posting; scores it automatically
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, company, location, job_url, description } = req.body;

    if (!title || !company || !description) {
      return res
        .status(400)
        .json({ error: 'title, company and description are required' });
    }

    const result = scoreJobAgainstCv(description, DEFAULT_CV_SKILLS);

    const id = await createJob({
      title,
      company,
      location,
      job_url,
      description,
      match_score: result.score,
      matched_skills: result.matchedSkills,
      missing_skills: result.missingSkills,
    });

    res.status(201).json({ id, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// GET /api/jobs — list all jobs, sorted by match score
router.get('/', async (_req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id — single job detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const job = await getJobById(Number(req.params.id));
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// PATCH /api/jobs/:id/status — update application status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, date_applied } = req.body;
    await updateJobStatus(Number(req.params.id), status, date_applied);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job status' });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await deleteJob(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
