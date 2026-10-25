function analyzeJobText(rawText) {
  const text = (rawText || '').trim();

  if (!text) {
    return {
      score: 0,
      riskLevel: 'No input',
      flags: [],
      summary: 'Paste a job description or message to begin the scan.',
      recommendations: [
        'Add job details such as company name, recruiter email, and interview process.',
      ],
    };
  }

  const normalized = text.toLowerCase();
  const flags = [];

  const riskRules = [
    { pattern: /(urgent|immediately|act now|hurry|limited time)/i, label: 'Urgent language' },
    { pattern: /(wire transfer|bitcoin|cash app|western union|gift card|money transfer)/i, label: 'Wire transfer request' },
    { pattern: /(no interview|interview not required|immediate hire|selected without interview)/i, label: 'No interview requirement' },
    { pattern: /(upfront fee|training fee|equipment fee|security deposit)/i, label: 'Paid upfront fee' },
    { pattern: /(gmail\.com|yahoo\.com|outlook\.com|telegram|whatsapp)/i, label: 'Unprofessional contact details' },
    { pattern: /(work from home|remote.*salary|earn\s*\$\d+|guaranteed income)/i, label: 'Unrealistic offer' },
    { pattern: /(poor grammar|please reply.*(telegram|whatsapp)|we need.*payment)/i, label: 'Suspicious communication style' },
  ];

  riskRules.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      flags.push(label);
    }
  });

  let score = 12 + flags.length * 25;

  if (normalized.includes('http') || normalized.includes('telegram') || normalized.includes('whatsapp')) {
    score += 10;
  }

  if (normalized.includes('formal interview') || normalized.includes('company website') || normalized.includes('job description')) {
    score = Math.max(0, score - 18);
  }

  score = Math.min(95, Math.max(5, score));

  let riskLevel;
  if (score >= 75) {
    riskLevel = 'High risk';
  } else if (score >= 40) {
    riskLevel = 'Medium risk';
  } else {
    riskLevel = 'Low risk';
  }

  const summary =
    riskLevel === 'High risk'
      ? 'This listing shows several strong scam indicators and should be treated with caution.'
      : riskLevel === 'Medium risk'
        ? 'This listing contains a few warning signs, but the overall picture is mixed.'
        : 'This listing looks relatively normal and includes standard hiring cues.';

  const recommendations =
    riskLevel === 'High risk'
      ? [
          'Verify the recruiter through a known company domain.',
          'Avoid any payment or equipment purchase request.',
          'Ask for a formal interview and a verifiable company profile.',
        ]
      : riskLevel === 'Medium risk'
        ? [
            'Check the company website and contact details carefully.',
            'Confirm whether the role has a formal interview stage.',
            'Look for inconsistencies in the description and compensation.',
          ]
        : [
            'Keep normal hiring practices in place.',
            'Confirm the company identity before sharing personal details.',
            'Continue checking for clarity and consistency in the job listing.',
          ];

  return {
    score: Math.round(score),
    riskLevel,
    flags: [...new Set(flags)],
    summary,
    recommendations,
  };
}

export { analyzeJobText };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeJobText,
  };
}
