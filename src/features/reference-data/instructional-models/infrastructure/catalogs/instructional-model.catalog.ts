import { PhaseIntent } from "@/features/reference-data/phase-intents/domain/types/PhaseIntent";
import { InstructionalModel } from "../../domain/types/InstructionalModel";
export const instructionalModelCatalog: InstructionalModel[] = [
  {
    id: "peerplaybook_core",
    label: "PeerPlaybook Core",
    description:
      "A flexible peer-led model for active, collaborative learning.",
    goodFor:
      "Most peer-led learning sessions, including tutoring, SI, study groups, review sessions, and mentoring.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "activation",
        label: "Activation",
        description:
          "Surface prior knowledge, focus the room, and get students participating early.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "exploration",
        label: "Exploration",
        description:
          "Invite students to examine ideas, examples, patterns, or misconceptions before moving into practice.",
        intent: PhaseIntent.EXPLORE,
        position: 1,
      },
      {
        key: "application",
        label: "Application",
        description:
          "Give the group a meaningful task that requires using, explaining, or practicing the concept.",
        intent: PhaseIntent.APPLY,
        position: 2,
      },
      {
        key: "reflection",
        label: "Reflection",
        description:
          "Close with synthesis, metacognition, confidence-checking, or next steps.",
        intent: PhaseIntent.REFLECT,
        position: 3,
      },
    ],
  },

  {
    id: "classic_si",
    label: "Classic SI",
    description:
      "A traditional Supplemental Instruction model for structured peer-led review.",
    goodFor:
      "Supplemental Instruction sessions, recurring study sessions, and structured peer-led review.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "opening",
        label: "Opening",
        description:
          "Reconnect students with prior learning, clarify today’s focus, and prepare the group for active work.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "main_activity",
        label: "Main Activity",
        description:
          "Engage students in collaborative work around difficult or high-value course concepts.",
        intent: PhaseIntent.APPLY,
        position: 1,
      },
      {
        key: "check_understanding",
        label: "Check Understanding",
        description:
          "Pause to surface misconceptions, compare reasoning, and reinforce key takeaways.",
        intent: PhaseIntent.EXPLORE,
        position: 2,
      },
      {
        key: "closing",
        label: "Closing",
        description:
          "Help students summarize learning, reflect on progress, and prepare for independent study.",
        intent: PhaseIntent.REFLECT,
        position: 3,
      },
    ],
  },

  {
    id: "exam_review",
    label: "Exam Review",
    description:
      "A focused review model for assessment prep and targeted practice.",
    goodFor:
      "Quiz review, midterm review, finals prep, cumulative review, and sessions where students need targeted practice.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "retrieve",
        label: "Retrieve",
        description:
          "Have students recall key concepts before reviewing answers or explanations.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "diagnose",
        label: "Diagnose",
        description:
          "Identify misconceptions, weak spots, and topics that need deeper attention.",
        intent: PhaseIntent.EXPLORE,
        position: 1,
      },
      {
        key: "practice",
        label: "Practice",
        description:
          "Solve representative problems, questions, or scenarios collaboratively.",
        intent: PhaseIntent.APPLY,
        position: 2,
      },
      {
        key: "study_plan",
        label: "Study Plan",
        description:
          "Reflect on readiness and create a concrete plan for what to study next.",
        intent: PhaseIntent.REFLECT,
        position: 3,
      },
    ],
  },

  {
    id: "workshop",
    label: "Collaborative Workshop",
    description:
      "A workshop model centered on collaborative problem solving.",
    goodFor:
      "Problem-solving sessions, coding practice, case studies, writing workshops, lab review, and project-based work.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "challenge",
        label: "Challenge",
        description:
          "Introduce the problem, scenario, task, or question that will anchor the session.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "investigate",
        label: "Investigate",
        description:
          "Explore possible approaches, relevant concepts, examples, or evidence.",
        intent: PhaseIntent.EXPLORE,
        position: 1,
      },
      {
        key: "build",
        label: "Build",
        description:
          "Work collaboratively to create a solution, explanation, product, or response.",
        intent: PhaseIntent.APPLY,
        position: 2,
      },
      {
        key: "share_reflect",
        label: "Share & Reflect",
        description:
          "Compare approaches, discuss takeaways, and identify what transfers to future work.",
        intent: PhaseIntent.REFLECT,
        position: 3,
      },
    ],
  },

  {
    id: "five_e",
    label: "5E Learning Cycle",
    description:
      "An inquiry model for discovery, evidence, and concept development.",
    goodFor:
      "Science learning, inquiry-based sessions, concept discovery, labs, demonstrations, and evidence-based reasoning.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "engage",
        label: "Engage",
        description:
          "Spark curiosity and surface what students notice, wonder, or predict.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "explore",
        label: "Explore",
        description:
          "Let students investigate patterns, examples, evidence, or phenomena.",
        intent: PhaseIntent.EXPLORE,
        position: 1,
      },
      {
        key: "explain",
        label: "Explain",
        description:
          "Consolidate meaning by having students articulate reasoning, definitions, or relationships.",
        intent: PhaseIntent.EXPLORE,
        position: 2,
      },
      {
        key: "elaborate",
        label: "Elaborate",
        description:
          "Extend understanding through a transfer task, challenge, or new situation.",
        intent: PhaseIntent.APPLY,
        position: 3,
      },
      {
        key: "evaluate",
        label: "Evaluate",
        description:
          "Assess understanding, reflect on confidence, and identify remaining questions.",
        intent: PhaseIntent.REFLECT,
        position: 4,
      },
    ],
  },

  {
    id: "four_as",
    label: "4A’s Lesson Model",
    description:
      "A structured model for developing concepts from examples and experience.",
    goodFor:
      "Concept development, guided discovery, structured review, and sessions where students need to move from examples to general principles.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "activity",
        label: "Activity",
        description:
          "Start with a task, example, question, scenario, or experience that students can respond to.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "analysis",
        label: "Analysis",
        description:
          "Guide students to examine what happened, notice patterns, and discuss meaning.",
        intent: PhaseIntent.EXPLORE,
        position: 1,
      },
      {
        key: "abstraction",
        label: "Abstraction",
        description:
          "Help students form the general concept, rule, principle, or explanation.",
        intent: PhaseIntent.EXPLORE,
        position: 2,
      },
      {
        key: "application",
        label: "Application",
        description:
          "Have students use the concept in a new problem, example, or real course task.",
        intent: PhaseIntent.APPLY,
        position: 3,
      },
    ],
  },

  {
    id: "peer_instruction",
    label: "Peer Instruction",
    description:
      "A discussion model for conceptual questions and peer reasoning.",
    goodFor:
      "Conceptual questions, STEM review, misconception checks, clicker-style questions, and reasoning-heavy topics.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "question",
        label: "Question",
        description:
          "Present a conceptual question, prediction prompt, or challenge.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "individual_commitment",
        label: "Individual Commitment",
        description:
          "Have students choose or write an initial answer before discussing.",
        intent: PhaseIntent.ACTIVATE,
        position: 1,
      },
      {
        key: "peer_discussion",
        label: "Peer Discussion",
        description:
          "Students explain, compare, and challenge each other’s reasoning.",
        intent: PhaseIntent.EXPLORE,
        position: 2,
      },
      {
        key: "reconsider",
        label: "Reconsider",
        description:
          "Students revise or defend their thinking after peer discussion.",
        intent: PhaseIntent.APPLY,
        position: 3,
      },
      {
        key: "debrief",
        label: "Debrief",
        description:
          "Clarify misconceptions and reflect on how reasoning changed.",
        intent: PhaseIntent.REFLECT,
        position: 4,
      },
    ],
  },

  {
    id: "study_sprint",
    label: "Study Sprint",
    description:
      "A lightweight model for focused work, check-ins, and accountability.",
    goodFor:
      "Study groups, tutoring check-ins, homework support, project work time, and sessions where students need structure more than a full lesson.",
    supportsCustomPhases: true,
    phases: [
      {
        key: "set_goal",
        label: "Set Goal",
        description:
          "Define what each student or group wants to accomplish during the sprint.",
        intent: PhaseIntent.ACTIVATE,
        position: 0,
      },
      {
        key: "focus_work",
        label: "Focus Work",
        description:
          "Work independently or collaboratively on the chosen task.",
        intent: PhaseIntent.APPLY,
        position: 1,
      },
      {
        key: "check_in",
        label: "Check-In",
        description: "Pause to share progress, blockers, and questions.",
        intent: PhaseIntent.EXPLORE,
        position: 2,
      },
      {
        key: "next_step",
        label: "Next Step",
        description:
          "End by naming what to continue, review, or complete after the session.",
        intent: PhaseIntent.REFLECT,
        position: 3,
      },
    ],
  },

  {
    id: "custom",
    label: "Custom",
    description:
      "A blank structure for unusual sessions or fully custom plans.",
    goodFor:
      "Experienced facilitators, unusual sessions, or cases where no preset model fits the plan.",
    supportsCustomPhases: true,
    phases: [],
  },
];
