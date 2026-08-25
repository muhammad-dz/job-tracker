-- Job Application Tracker — MySQL schema
-- Run this once against a fresh database to set up tables.

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  job_url VARCHAR(512),
  description TEXT NOT NULL,
  match_score INT NOT NULL DEFAULT 0,
  matched_skills JSON,
  missing_skills JSON,
  status ENUM(
    'not_applied',
    'applied',
    'interview',
    'offer',
    'rejected',
    'withdrawn'
  ) NOT NULL DEFAULT 'not_applied',
  date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_applied DATETIME NULL,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_match_score ON jobs(match_score);
