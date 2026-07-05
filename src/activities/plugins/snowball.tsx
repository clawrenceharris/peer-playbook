import React, { useState } from "react";
import { Button, Textarea } from "@/components/ui";
import { PlaybookContext, PlaybookDefinition } from "@/types/playbook.types";
import { CircleQuestionMark } from "lucide-react";

function SnowballCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Hidden question"
      onClick={onClick}
      className="center-all h-10 w-10 rounded-full bg-white shadow-md"
    >
      <CircleQuestionMark />
    </button>
  );
}

// -----------------------------
// Participant UI
// -----------------------------
function SnowballUI({ ctx }: { ctx: PlaybookContext }) {
  const phase = ctx.state.phase || "write";
  const pool = ctx.state.pool || {};
  const chosen = ctx.state.chosen || {};
  const originalPool = ctx.state.originalPool || {};
  const [myQuestion, setMyQuestion] = useState("");

  if (phase === "write") {
    return (
      <div className="space-y-3">
        <p className="font-medium">Write a question</p>
        <Textarea
          value={myQuestion}
          onChange={(e) => setMyQuestion(e.target.value)}
          className="w-full rounded border !bg-black/5 p-2"
        />
        <Button
          onClick={() => {
            if (!myQuestion) return;
            ctx.call.sendCustomEvent({
              type: "snowball:submit",
              userId: ctx.userId,
              question: myQuestion,
            });
            setMyQuestion("");
          }}
        >
          Submit
        </Button>
      </div>
    );
  }

  if (phase === "pick") {
    const myChoiceId = chosen?.[ctx.userId];

    // If this user has already picked, show their chosen one
    if (myChoiceId) {
      return (
        <div className="space-y-3">
          <p className="font-medium">You picked this question:</p>
          <div className="rounded-xl bg-white p-3">
            {originalPool[myChoiceId]}
          </div>
        </div>
      );
    }

    // Otherwise, show the pool to pick from
    return (
      <div className="h-full w-full space-y-3 overflow-hidden">
        <p className="font-medium">Pick a question to answer:</p>
        <div className="faded-row mx-auto grid h-[200px] w-full auto-cols-[minmax(40px,1fr)] grid-flow-col grid-rows-3 gap-3 overflow-auto">
          {Object.entries(pool).map(([id]) => (
            <SnowballCard
              key={id}
              onClick={() => {
                ctx.call.sendCustomEvent({
                  type: "snowball:pick",
                  userId: ctx.userId,
                  questionId: id,
                });
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === "discuss") {
    const myChoiceId = chosen?.[ctx.userId];
    return (
      <div className="space-y-3">
        <p className="font-medium">Discussion Phase</p>
        {myChoiceId ? (
          <div className="space-y-2">
            <p className="italic">You’re answering:</p>
            <div className="rounded-xl bg-white p-3">
              {originalPool[myChoiceId]}
            </div>
          </div>
        ) : (
          <p className="italic">Take turns discussing chosen questions!</p>
        )}
      </div>
    );
  }

  return null;
}

// -----------------------------
// Host Controls
// -----------------------------
function SnowballHostControls({ ctx }: { ctx: PlaybookContext }) {
  const phase = ctx.state.phase || "write";

  if (phase === "write") {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          ctx.call.sendCustomEvent({
            type: "snowball:assign",
            questions: ctx.state.pool,
          });
        }}
      >
        Publish Questions
      </Button>
    );
  }

  if (phase === "pick") {
    return (
      <Button
        onClick={() => {
          ctx.call.sendCustomEvent({ type: "snowball:discuss" });
        }}
      >
        Start Discussion
      </Button>
    );
  }

  return null;
}

// -----------------------------
// Definition
// -----------------------------
export const SnowballActivity: PlaybookDefinition = {
  slug: "snowball",
  title: "Snowball",
  phases: ["write", "pick", "discuss"],
  start(ctx: PlaybookContext) {
    ctx.call.sendCustomEvent({ type: "snowball:start", slug: "pass-problem" });
    ctx.setState({ phase: "write", teamSteps: {} });
  },
  handleEvent(e, ctx) {
    switch (e.custom.type) {
      case "snowball:submit": {
        const qid = `${e.custom.userId}-${Date.now()}`;
        const newPool = { ...ctx.state.pool, [qid]: e.custom.question };
        ctx.setState({
          ...ctx.state,
          pool: newPool,
          originalPool: { ...ctx.state.originalPool, [qid]: e.custom.question },
        });
        break;
      }

      case "snowball:assign": {
        ctx.setState({
          ...ctx.state,
          phase: "pick",
          pool: e.custom.questions,
          originalPool: { ...ctx.state.originalPool, ...e.custom.questions },
          chosen: {},
        });
        break;
      }

      case "snowball:pick": {
        const { userId, questionId } = e.custom;
        const newPool = { ...ctx.state.pool };
        delete newPool[questionId];
        const newChosen = { ...(ctx.state.chosen || {}), [userId]: questionId };

        ctx.setState({
          ...ctx.state,
          pool: newPool,
          chosen: newChosen,
        });
        break;
      }

      case "snowball:discuss": {
        ctx.setState({ ...ctx.state, phase: "discuss" });
        break;
      }
    }
  },

  Component: SnowballUI,
  HostControls: SnowballHostControls,
};
