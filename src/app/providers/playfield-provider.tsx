/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
  createContext,
} from "react";
import type { PlayfieldContext, PlayfieldDefinition } from "@/features/playfield/domain";
import { CustomVideoEvent } from "@stream-io/video-react-sdk";
import { registry } from "@/activities/registry";
import { PlaybookStrategy } from "@/features/playbooks/domain";
import { useSessionCall } from ".";
import { toast } from "react-toastify";
import { usePlayfieldLayout, UsePlayfieldLayoutReturn } from "@/features/playfield/hooks";

interface PlayfieldContextType {
  strategy: PlayfieldDefinition | null;
  ctx: PlayfieldContext;
  isLoading: boolean;
  reactions: { id: string; userId: string; emoji: string }[];
  startStrategy: (strategy: PlaybookStrategy) => void;
  endStrategy: () => void;
  handleReaction: (emoji: string, userId: string) => void;
  syncLocal: () => void;
  layout: UsePlayfieldLayoutReturn;
}

interface PlayfieldProviderProps {
  children: React.ReactNode;
}

export function PlayfieldProvider({ children }: PlayfieldProviderProps) {
  const { activeCall: call } = useSessionCall();
  const [strategy, setStrategy] = useState<PlayfieldDefinition | null>(null);
  const [phase, setPhase] = useState<PlaybookStrategy["phase"]>("warmup");
  const [state, setState] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const layout = usePlayfieldLayout();
  const [currentEvent, setCurrentEvent] = useState<CustomVideoEvent | null>(
    null
  );
  const [reactions, setReactions] = useState<
    { id: string; userId: string; emoji: string }[]
  >([]);

  //---- Strategy State -----//

  const startStrategy = useCallback(
    async (strategy: PlaybookStrategy) => {
      const strategySlug = strategy.slug || strategy.cardSlug;
      const strategyDefinition = strategySlug ? registry[strategySlug] : undefined;

      try {
        if (!strategyDefinition)
          throw new Error("This strategy could not be found");

        setIsLoading(true);
        setPhase("warmup");

        await call.sendCustomEvent({ type: `${strategySlug}:start` });

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Couldn't run Strategy. Please try again later."
        );
      }
    },
    [call]
  );

  useEffect(() => {
    if (call.isCreatedByMe)
      call.update({
        custom: {
          strategySlug: strategy?.slug ?? undefined,
          currentEvent,
        },
      });
  }, [call, currentEvent, strategy?.slug]);
  const endStrategy = useCallback(async () => {
    if (!strategy) return;
    try {
      await call.sendCustomEvent({ type: `${strategy.slug}:end` });
      setStrategy(null);
      setCurrentEvent(null);
      setState({});
    } catch {
      toast.error("We could not complete this action.");
    }
  }, [call, strategy]);

  const ctx = useMemo(
    () =>
      ({
        call: call,
        userId: call.currentUserId,
        state,
        phase,
        isHost: false,
        slug: strategy?.slug,
        setState,
      } as unknown as PlayfieldContext),
    [call, phase, state, strategy?.slug]
  );

  //----- Parsing events-----//
  const parseEventType = (event: CustomVideoEvent) => {
    const payload = event.custom;
    const parts = payload?.type.split(":"); //must be in slug-or-type:event-name format

    if (parts?.length !== 2) {
      throw new Error(
        "Custom event must have a type and be in the format slug-or-type:event-name"
      );
    }

    return parts[0];
  };

  const parseEventValue = (event: CustomVideoEvent): string => {
    const payload = event.custom;
    const parts = payload?.type.split(":"); //must be in slug-or-type:event-name format

    if (parts?.length !== 2) {
      throw new Error(
        "Custom event must have a type and be in the format slug-or-type:event-name"
      );
    }

    return parts[1];
  };

  //---- Reactions ----//
  const handleReaction = (emoji: string, userId: string) => {
    const id = crypto.randomUUID();
    setReactions((prev) => [...prev, { userId, id, emoji }]);

    // remove emoji after animation
    setTimeout(() => {
      setReactions((prev) => prev.filter((e) => e.id !== id));
    }, 2500);
  };

  //---- Event handling -----//

  const syncLocal = useCallback(() => {
    const slug = call.state.custom.strategySlug;

    const event = call.state.custom.currentEvent;
    const strategyDefinition = registry[slug];

    if (!event || !strategyDefinition) return;
    setStrategy(null);
    // strategyDefinition.handleEvent(event, ctx);
  }, [call.state.custom.currentEvent, call.state.custom.strategySlug]);
  useEffect(() => {
    const unsubscribe = call.on("call.session_participant_joined", () => {
      syncLocal();
    });
    return () => unsubscribe();
  }, [call, syncLocal]);

  const handleEvent = useCallback(
    (event: CustomVideoEvent, phase: PlaybookStrategy["phase"]) => {
      const type = parseEventType(event);
      const value = parseEventValue(event);

      switch (value) {
        case "start": {
          const strategy = registry[type];
          setPhase(phase);
          // setStrategy(strategy);
          break;
        }
        case "end": {
          endStrategy();
          break;
        }

        case "reaction": {
          handleReaction(type, event.user.id);
          break;
        }
        default: {
          strategy?.handleEvent(event, ctx);
        }
      }
    },
    [ctx, endStrategy, strategy]
  );

  useEffect(() => {
    const handler = (
      e: CustomVideoEvent,
      phase: PlaybookStrategy["phase"]
    ) => {
      try {
        if (e.custom.roomId && e.custom.roomId !== ctx.state.roomId) return;
        handleEvent(e, phase);
      } catch (error) {
        toast.error("We could not complete this action.");
        console.error(error);
      }
    };

    const unsubscribe = call.on("custom", (e) => handler(e, phase));
    return () => unsubscribe();
  }, [call, ctx.state.roomId, handleEvent, phase, strategy]);

  const value = {
    strategy,
    ctx,
    layout,
    reactions,
    isLoading,
    startStrategy,
    endStrategy,
    handleReaction,
    syncLocal,
  };

  return (
    <PlayfieldContext.Provider value={value}>
      {children}
    </PlayfieldContext.Provider>
  );
}
const PlayfieldContext = createContext<PlayfieldContextType | undefined>(
  undefined
);

export function usePlayfield() {
  const context = useContext(PlayfieldContext);
  if (!context)
    throw new Error("usePlayfield must be used within a PlayfieldProvider.");
  return context;
}
