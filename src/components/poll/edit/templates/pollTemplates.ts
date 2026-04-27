import { PollTemplate } from "@/types"

export const POLL_TEMPLATES: PollTemplate[] = [
  /* ── Assessment ── */
  {
    id: "quick-quiz",
    name: "Quick Quiz",
    description:
      "5 multiple-choice questions with 4 options each. Fill in your own prompts.",
    icon: "quiz",
    category: "assessment",
    questions: [
      {
        question: "Question 1",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      },
      {
        question: "Question 2",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      },
      {
        question: "Question 3",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      },
      {
        question: "Question 4",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      },
      {
        question: "Question 5",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct_answer: "Option A",
      },
    ],
  },
  {
    id: "true-false",
    name: "True / False",
    description:
      "5 true-or-false questions. Great for reading checks and quick recall.",
    icon: "true-false",
    category: "assessment",
    questions: [
      {
        question: "Question 1",
        options: ["True", "False"],
        correct_answer: "True",
      },
      {
        question: "Question 2",
        options: ["True", "False"],
        correct_answer: "True",
      },
      {
        question: "Question 3",
        options: ["True", "False"],
        correct_answer: "True",
      },
      {
        question: "Question 4",
        options: ["True", "False"],
        correct_answer: "True",
      },
      {
        question: "Question 5",
        options: ["True", "False"],
        correct_answer: "True",
      },
    ],
  },
  {
    id: "vocab-check",
    name: "Vocabulary Check",
    description:
      "4 definition-matching questions. Students pick the correct definition.",
    icon: "vocab",
    category: "assessment",
    questions: [
      {
        question: "Define term 1",
        options: [
          "Definition A",
          "Definition B",
          "Definition C",
          "Definition D",
        ],
        correct_answer: "Definition A",
      },
      {
        question: "Define term 2",
        options: [
          "Definition A",
          "Definition B",
          "Definition C",
          "Definition D",
        ],
        correct_answer: "Definition A",
      },
      {
        question: "Define term 3",
        options: [
          "Definition A",
          "Definition B",
          "Definition C",
          "Definition D",
        ],
        correct_answer: "Definition A",
      },
      {
        question: "Define term 4",
        options: [
          "Definition A",
          "Definition B",
          "Definition C",
          "Definition D",
        ],
        correct_answer: "Definition A",
      },
    ],
  },

  /* ── Feedback ── */
  {
    id: "exit-ticket",
    name: "Exit Ticket",
    description:
      "3 end-of-class reflection questions. Ready to host immediately.",
    icon: "exit-ticket",
    category: "feedback",
    questions: [
      {
        question: "What did you learn today?",
        options: [
          "A new concept I hadn't seen before",
          "A deeper understanding of something familiar",
          "A practical skill I can apply",
          "I'm not sure yet",
        ],
        correct_answer: "",
      },
      {
        question: "How confident do you feel about today's material?",
        options: [
          "Very confident",
          "Somewhat confident",
          "Not very confident",
          "Not confident at all",
        ],
        correct_answer: "",
      },
      {
        question: "What was most confusing today?",
        options: [
          "Nothing — I followed everything",
          "The main concept",
          "The examples or applications",
          "The terminology",
        ],
        correct_answer: "",
      },
    ],
  },
  {
    id: "course-survey",
    name: "Course Survey",
    description:
      "4 questions on pace, difficulty, and satisfaction. No correct answers.",
    icon: "survey",
    category: "feedback",
    questions: [
      {
        question: "How would you rate the pace of today's class?",
        options: ["Too fast", "Slightly fast", "Just right", "Too slow"],
        correct_answer: "",
      },
      {
        question: "How difficult was today's material?",
        options: ["Very easy", "Manageable", "Challenging", "Overwhelming"],
        correct_answer: "",
      },
      {
        question: "Which part of today's class was most valuable?",
        options: [
          "The lecture / explanation",
          "The examples / demos",
          "The discussion",
          "The practice problems",
        ],
        correct_answer: "",
      },
      {
        question: "What would improve this class the most?",
        options: [
          "More examples",
          "More practice time",
          "Slower pace",
          "More interactive activities",
        ],
        correct_answer: "",
      },
    ],
  },

  /* ── Engagement ── */
  {
    id: "icebreaker",
    name: "Icebreaker",
    description: "3 fun warm-up questions to get the class talking.",
    icon: "icebreaker",
    category: "engagement",
    questions: [
      {
        question: "If you could have any superpower, what would it be?",
        options: [
          "Time travel",
          "Invisibility",
          "Super strength",
          "Teleportation",
        ],
        correct_answer: "",
      },
      {
        question: "What's your go-to study snack?",
        options: ["Coffee / Tea", "Chips / Crackers", "Fruit", "Nothing"],
        correct_answer: "",
      },
      {
        question: "Would you rather have class outdoors or in a coffee shop?",
        options: [
          "Outdoors — fresh air",
          "Coffee shop — cozy vibes",
          "Neither — the classroom is fine",
          "Both — depends on the weather",
        ],
        correct_answer: "",
      },
    ],
  },
  {
    id: "muddiest-point",
    name: "Muddiest Point",
    description:
      "2 questions to identify what confused students the most today.",
    icon: "muddiest",
    category: "engagement",
    questions: [
      {
        question: "Which topic was most confusing today?",
        options: [
          "Topic A (replace with your topic)",
          "Topic B (replace with your topic)",
          "Topic C (replace with your topic)",
          "Nothing was confusing",
        ],
        correct_answer: "",
      },
      {
        question: "What would help you understand it better?",
        options: [
          "More examples",
          "A visual diagram",
          "Practice problems",
          "A one-on-one explanation",
        ],
        correct_answer: "",
      },
    ],
  },
  {
    id: "discussion-prep",
    name: "Discussion Prep",
    description:
      "3 opinion questions to spark classroom debate. No right answers.",
    icon: "discussion",
    category: "engagement",
    questions: [
      {
        question: "Do you agree or disagree with today's main argument?",
        options: [
          "Strongly agree",
          "Somewhat agree",
          "Somewhat disagree",
          "Strongly disagree",
        ],
        correct_answer: "",
      },
      {
        question: "How confident are you in your position?",
        options: [
          "Very confident — I could defend it",
          "Fairly confident",
          "Not very confident",
          "I need to think about it more",
        ],
        correct_answer: "",
      },
      {
        question: "Which counterargument is the strongest?",
        options: [
          "Counterargument A (replace)",
          "Counterargument B (replace)",
          "Counterargument C (replace)",
          "None of them are convincing",
        ],
        correct_answer: "",
      },
    ],
  },
]
