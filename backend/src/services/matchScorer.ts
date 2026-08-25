/**
 * matchScorer.ts
 *
 * Compares a job posting's text against the user's CV skills/keywords
 * and produces a 0-100 match score plus a breakdown of matched and
 * missing skills. This is intentionally transparent (no black-box ML)
 * so the score can be explained to the user, and so it's a good
 * talking point in an interview: you can walk through exactly why a
 * job scored the way it did.
 */

export interface SkillWeight {
  skill: string;
  weight: number; // 1 = nice-to-have, 2 = core skill, 3 = flagship skill
}

export interface ScoreResult {
  score: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  totalPossible: number;
  totalMatched: number;
}

/**
 * Normalises text for matching: lowercase, strip punctuation,
 * collapse whitespace. Keeps things like "c#" and "node.js" intact
 * by treating # and . as safe-to-keep characters within tokens.
 */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#.+\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds a simple word-boundary-safe regex for a given skill so that
 * "java" doesn't false-positive match inside "javascript".
 */
function skillRegex(skill: string): RegExp {
  const escaped = skill
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');
}

/**
 * Scores a job description against a weighted list of the user's
 * skills. Returns a 0-100 score plus matched/missing breakdowns so
 * the UI can show exactly why a job got the score it did.
 */
export function scoreJobAgainstCv(
  jobText: string,
  cvSkills: SkillWeight[]
): ScoreResult {
  const normalisedJobText = normalise(jobText);

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let totalPossible = 0;
  let totalMatched = 0;

  for (const { skill, weight } of cvSkills) {
    totalPossible += weight;
    const pattern = skillRegex(skill);
    if (pattern.test(normalisedJobText)) {
      matchedSkills.push(skill);
      totalMatched += weight;
    } else {
      missingSkills.push(skill);
    }
  }

  const score =
    totalPossible === 0 ? 0 : Math.round((totalMatched / totalPossible) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    totalPossible,
    totalMatched,
  };
}

/**
 * Default skill set derived from the user's CV. In a real deployment
 * this would live in the database and be editable via the UI, but a
 * sensible hard-coded default keeps the MVP simple.
 */
export const DEFAULT_CV_SKILLS: SkillWeight[] = [
  { skill: 'javascript', weight: 3 },
  { skill: 'typescript', weight: 2 },
  { skill: 'python', weight: 3 },
  { skill: 'java', weight: 1 },
  { skill: 'php', weight: 2 },
  { skill: 'sql', weight: 3 },
  { skill: 'mysql', weight: 2 },
  { skill: 'html', weight: 2 },
  { skill: 'css', weight: 2 },
  { skill: 'react', weight: 3 },
  { skill: 'node.js', weight: 2 },
  { skill: 'node', weight: 2 },
  { skill: 'git', weight: 2 },
  { skill: 'github', weight: 1 },
  { skill: 'aws', weight: 1 },
  { skill: 'rest api', weight: 2 },
  { skill: 'agile', weight: 2 },
  { skill: 'scrum', weight: 1 },
  { skill: 'sdlc', weight: 1 },
  { skill: 'oop', weight: 1 },
  { skill: 'unit testing', weight: 2 },
  { skill: 'jest', weight: 1 },
];
