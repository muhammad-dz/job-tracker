import { scoreJobAgainstCv, SkillWeight } from '../src/services/matchScorer';

describe('scoreJobAgainstCv', () => {
  const sampleCv: SkillWeight[] = [
    { skill: 'python', weight: 3 },
    { skill: 'sql', weight: 3 },
    { skill: 'react', weight: 2 },
    { skill: 'java', weight: 1 },
  ];

  it('scores highly when the flagship and core skills are present', () => {
    const jobText =
      'We need someone strong in Python, SQL and React for this role.';
    const result = scoreJobAgainstCv(jobText, sampleCv);

    // python(3) + sql(3) + react(2) = 8 out of a possible 9 (java(1) missing)
    expect(result.score).toBe(89);
    expect(result.matchedSkills).toEqual(
      expect.arrayContaining(['python', 'sql', 'react'])
    );
    expect(result.missingSkills).toContain('java');
  });

  it('scores 0 when no skills are present', () => {
    const jobText = 'We are looking for a PHP and Laravel developer.';
    const result = scoreJobAgainstCv(jobText, sampleCv);

    expect(result.score).toBe(0);
    expect(result.matchedSkills).toHaveLength(0);
    expect(result.missingSkills).toHaveLength(4);
  });

  it('weights flagship skills more heavily than nice-to-haves', () => {
    // python (weight 3) matches, java (weight 1) does not.
    // Only python+sql+react are needed for the majority of the score.
    const jobTextWithFlagship =
      'Looking for a Python and SQL and React developer.';
    const jobTextWithOnlyMinor = 'Looking for a Java developer.';

    const resultFlagship = scoreJobAgainstCv(jobTextWithFlagship, sampleCv);
    const resultMinor = scoreJobAgainstCv(jobTextWithOnlyMinor, sampleCv);

    expect(resultFlagship.score).toBeGreaterThan(resultMinor.score);
  });

  it('does not false-positive match substrings (java vs javascript)', () => {
    const cvWithJava: SkillWeight[] = [{ skill: 'java', weight: 1 }];
    const jobText = 'We use JavaScript extensively across our stack.';

    const result = scoreJobAgainstCv(jobText, cvWithJava);

    expect(result.matchedSkills).toHaveLength(0);
    expect(result.missingSkills).toContain('java');
  });

  it('matches skills regardless of case', () => {
    const jobText = 'PYTHON and Sql experience required.';
    const result = scoreJobAgainstCv(jobText, sampleCv);

    expect(result.matchedSkills).toEqual(
      expect.arrayContaining(['python', 'sql'])
    );
  });

  it('handles an empty skills list without crashing', () => {
    const result = scoreJobAgainstCv('Any job text here.', []);
    expect(result.score).toBe(0);
    expect(result.totalPossible).toBe(0);
  });

  it('matches skills containing special characters like node.js', () => {
    const cvWithNode: SkillWeight[] = [{ skill: 'node.js', weight: 2 }];
    const jobText = 'Experience with Node.js backends required.';

    const result = scoreJobAgainstCv(jobText, cvWithNode);
    expect(result.matchedSkills).toContain('node.js');
  });
});
