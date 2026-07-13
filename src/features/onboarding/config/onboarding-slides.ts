import type { OnboardingSlide } from "../domain/types/onboarding-slide";

export const roleOptions: {
  id: string;
  label: string;
  description: string;
}[] = [
  {
    id: "si_leader",
    label: "I'm a Supplemental Instruction (SI) Leader",
    description:
      "Leading collaborative lecture review sessions for your course.",
  },
  {
    id: "tutor",
    label: "I'm a peer tutor",
    description:
      "Helping students through challenging concepts and assignments.",
  },
  {
    id: "ta",
    label: "I'm a teaching assistant (TA)",
    description:
      "Supporting instruction, study sessions, grading, or lab sections.",
  },
  {
    id: "recitation_leader",
    label: "I'm a recitation leader",
    description: "Leading smaller discussion or problem-solving sections.",
  },
  {
    id: "student_mentor",
    label: "I'm a student mentor",
    description: "Guiding peers through coursework and campus life.",
  },
  {
    id: "club_leader",
    label: "I'm a club leader",
    description: "Organizing academic or interest-based student groups.",
  },
  {
    id: "study_group_organizer",
    label: "I'm a study group organizer",
    description:
      "Planning and inviting students to peer study sessions after class.",
  },
  {
    id: "coordinator",
    label: "I'm a coordinator",
    description: "Managing tutors, SI leaders, or a learning center program.",
  },
  {
    id: "student",
    label: "I'm simply a student",
    description: "Looking for study support and peer-led sessions.",
  },
];

export const roleToProfileRole = {
  si_leader: "si_leader",
  tutor: "si_leader",
  ta: "si_leader",
  recitation_leader: "si_leader",
  student_mentor: "si_leader",
  club_leader: "coordinator",
  study_group_organizer: "coordinator",
  coordinator: "coordinator",
  student: "student",
} as const satisfies Record<
  (typeof roleOptions)[number]["id"],
  "si_leader" | "student" | "coordinator"
>;

export const subjects: { id: string; label: string; description: string }[] = [
  {
    id: "biology",
    label: "Biology",
    description:
      '"Nothing in biology makes sense except in the light of evolution." – Theodosius Dobzhansky',
  },
  {
    id: "chemistry",
    label: "Chemistry",
    description:
      '"Chemistry is necessarily an experimental science: its conclusions are drawn from data, and its principles supported by evidence from facts." – Michael Faraday',
  },
  {
    id: "coding",
    label: "Coding",
    description:
      '"Programs must be written for people to read, and only incidentally for machines to execute." – Harold Abelson',
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    description:
      '"The best defense against hackers is diligence." – Kevin Mitnick',
  },
  {
    id: "geography",
    label: "Geography",
    description:
      '"Geography is the subject which holds the key to our future." – Michael Palin',
  },
  {
    id: "math",
    label: "Math",
    description:
      '"Pure mathematics is, in its way, the poetry of logical ideas." – Albert Einstein',
  },
  {
    id: "physics",
    label: "Physics",
    description:
      '"If I have seen further it is by standing on the shoulders of Giants." – Isaac Newton',
  },
  {
    id: "science",
    label: "Science",
    description:
      '"The important thing is to never stop questioning." – Albert Einstein',
  },
  {
    id: "other",
    label: "Other",
    description:
      '"Education is the most powerful weapon which you can use to change the world." – Nelson Mandela',
  },
];
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Welcome to PeerPlaybook!",
    description: "Let's set up your profile for the best experience.",
    message:
      "Students who study with peers retain up to 50% more than those going solo — collaborative learning really works.",
    skippable: false,
    fields: [],
  },

  {
    id: "role",
    title: "What best describes your role?",
    description:
      "Pick the option that fits you best. You can update this later.",
    message:
      "Supplemental Instruction programs have been shown to cut course failure rates by 10–20% — peer leaders make a measurable difference.",
    skippable: false,
    fields: [
      {
        type: "single-choice",
        fieldKey: "role",
        label: "Your Role",
        required: true,
        options: roleOptions.map((role) => ({
          id: role.id,
          label: role.label,
          description: role.description,
        })),
      },
    ],
  },

  {
    id: "courses",
    title: "What do you help students learn?",
    description:
      "Select all subjects you lead, tutor, or help students learn in.",
    message:
      "The average person forgets about half of new information within an hour — revisiting material across sessions is one of the oldest tricks in learning science.",
    skippable: true,

    fields: [
      {
        type: "multi-choice",
        fieldKey: "courses",
        label: "Your Subjects",
        required: false,
        min: 0,
        options: subjects.map((subject) => ({
          id: subject.id,
          label: subject.label,
          description: subject.description,
        })),
      },
    ],
  },

  {
    id: "school",
    title: "What school do you belong to?",
    description:
      "Adding your school helps PeerPlaybook connect you with other students and educators at your institution.",
    message:
      "Thousands of campuses worldwide run peer-led academic support programs — from tutoring centers to SI to recitation sections.",
    skippable: true,

    fields: [
      {
        type: "text",
        fieldKey: "school",
        label: "Your School",
        placeholder: "e.g. University of California, Los Angeles",
        required: false,
      },
    ],
  },
  {
    id: "data-consent",
    title: "One last thing",
    description:
      "Before you start lesson planning, help us improve your experience by allowing PeerPlaybook to use your information.",
    message:
      "Educators who get feedback on what works in their sessions iterate faster — small improvements compound into better outcomes over a semester.",
    skippable: false,
    fields: [
      {
        type: "consent",
        fieldKey: "dataConsentAccepted",
        label:
          "I allow PeerPlaybook to use my information to improve my user experience.",
        required: true,
      },
    ],
  },
];
