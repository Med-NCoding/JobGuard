export const EXAMPLES = [
  {
    id: "scam-task",
    label: "App Rating Scam",
    tag: "SCAM",
    message:
      "Hello! Excellent remote job opportunity. Earn $300 per day by rating apps online. It takes only 30 minutes a day. Payment sent via USDT or bank wire. Interested? Add our manager on Telegram: @app_ranking_pro",
  },
  {
    id: "scam-check",
    label: "Equipment Check Fraud",
    tag: "SCAM",
    message:
      "CONGRATULATIONS! You have been accepted for a remote data verification role at Pfizer Pharmaceuticals. Monthly salary is $9,000. Before we ship your corporate apple workstation, you must send a refundable insurance fee of $120 via Bitcoin or Razer Gold gift card. Reply now.",
  },
  {
    id: "legit-recruiter",
    label: "Real Recruiter",
    tag: "LEGIT",
    message:
      "Hi Natalie, I hope you're doing well. I'm a recruiter at Pinterest, and I'm currently looking for an ML Data Scientist to join our Ads Ranking team. I noticed your published work on recommendation systems and deep learning. Your academic and practical background seems like a fantastic match for the technical challenges our team faces. Would you be open to a brief connection call this Thursday afternoon?",
  },
];

export const PLAYBOOK_STAGES = [
  {
    stage: 1,
    title: "Platform Redirect",
    description: "Moving off LinkedIn/email to Telegram or WhatsApp for a 'text interview'.",
    userPrompt: "Yes, I am interested! How do I apply?",
  },
  {
    stage: 2,
    title: "Fake Task & Offer",
    description: "Instant hire with a trivial app rating task and generic PDF contract.",
    userPrompt: "I've joined the Telegram group. What's next?",
  },
  {
    stage: 3,
    title: "Check / Invoice Fraud",
    description: "A bad check arrives for 'equipment'—you deposit it, wire real money, check bounces.",
    userPrompt: "I've signed the offer letter. How do I get my workstation?",
  },
];
