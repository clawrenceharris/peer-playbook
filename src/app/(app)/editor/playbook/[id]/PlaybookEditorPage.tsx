// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { PlaybookCard } from "@/features/playbooks/components";
// import {
//   usePlaybook,
//   usePlaybookSortedStrategies,
//   useUpdatePlaybookStrategy,
// } from "@/features/playbooks/hooks";
// import { PlaybookStrategy, PlaybookStrategyUpdate } from "@/features/playbooks/domain";
// import { EmptyState, ErrorState, LoadingState } from "@/components/states";
// import { getUserErrorMessage } from "@/utils";
// import { StrategySidebar } from "@/features/playbooks/components/editor/strategy-sidebar";
// import { StrategyEditorSection } from "@/features/playbooks/components/editor/strategy-editor-section";
// import { usePendingMutations } from "@/hooks";
// import { BeforeUnload } from "@/components/form/before-unload";

// export default function PlaybookEditorPage({
//   playbookId,
// }: {
//   playbookId: string;
// }) {
//   const router = useRouter();
//   const { data: playbook, error, isLoading } = usePlaybook(playbookId);
//   const { data: sortedStrategies = [] } =
//     usePlaybookSortedStrategies(playbookId);
//   const { mutateAsync: updatePlaybookStrategy } = useUpdatePlaybookStrategy();
//   const { pending: isSaving } = usePendingMutations({
//     mutationKey: ["update-playbook-strategy"],
//   });
//   const [strategies, setStrategies] = useState<PlaybookStrategy[]>([]);
//   const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
//   const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const editorsScrollRef = useRef<HTMLDivElement | null>(null);
//   const scrollRafRef = useRef<number | null>(null);
//   const [isDirty, setIsDirty] = useState(false);
//   const updateTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
//   const queuedUpdates = useRef<Record<string, PlaybookStrategyUpdate>>({});
//   useEffect(() => {
//     setStrategies(sortedStrategies);
//   }, [sortedStrategies]);

//   useEffect(() => {
//     if (!activeStrategyId && sortedStrategies.length > 0) {
//       setActiveStrategyId(sortedStrategies[0].id);
//     }
//   }, [activeStrategyId, sortedStrategies]);

//   useEffect(() => {
//     const timers = updateTimers.current;
//     return () => {
//       if (scrollRafRef.current) {
//         cancelAnimationFrame(scrollRafRef.current);
//       }
//       Object.values(timers).forEach((timer) => clearTimeout(timer));
//     };
//   }, []);

//   const handleUpdateStrategy = useCallback(
//     (strategyId: string, updates: Partial<PlaybookStrategy>) => {
//       setStrategies((prev) =>
//         prev.map((strategy) =>
//           strategy.id === strategyId ? { ...strategy, ...updates } : strategy,
//         ),
//       );
//       setIsDirty(true);

//       queuedUpdates.current[strategyId] = {
//         ...(queuedUpdates.current[strategyId] ?? {}),
//         ...(updates as PlaybookStrategyUpdate),
//       };

//       if (updateTimers.current[strategyId]) {
//         clearTimeout(updateTimers.current[strategyId]);
//       }

//       updateTimers.current[strategyId] = setTimeout(async () => {
//         const data = queuedUpdates.current[strategyId];
//         delete queuedUpdates.current[strategyId];
//         try {
//           await updatePlaybookStrategy({ playbookId, strategyId, data });
//           setIsDirty(false);
//         } finally {
//           delete updateTimers.current[strategyId];
//         }
//       }, 900);
//     },
//     [playbookId, updatePlaybookStrategy],
//   );

//   const setSectionRef = useCallback(
//     (strategyId: string) => (node: HTMLDivElement | null) => {
//       sectionRefs.current[strategyId] = node;
//     },
//     [],
//   );

//   const scrollToStrategy = useCallback((strategyId: string) => {
//     const container = editorsScrollRef.current;
//     const node = sectionRefs.current[strategyId];
//     if (!container || !node) return;

//     const containerRect = container.getBoundingClientRect();
//     const nodeRect = node.getBoundingClientRect();
//     const left = nodeRect.left - containerRect.left + container.scrollLeft;

//     container.scrollTo({ left, behavior: "smooth" });
//   }, []);

//   const handleSidebarClick = useCallback(
//     (strategyId: string) => {
//       setActiveStrategyId(strategyId);
//       scrollToStrategy(strategyId);
//     },
//     [scrollToStrategy],
//   );

//   const handleEditorsScroll = useCallback(() => {
//     const container = editorsScrollRef.current;
//     if (!container || strategies.length === 0) return;

//     if (scrollRafRef.current) {
//       cancelAnimationFrame(scrollRafRef.current);
//     }

//     scrollRafRef.current = requestAnimationFrame(() => {
//       const centerX = container.scrollLeft + container.clientWidth / 2;
//       let bestId: string | null = null;
//       let bestDistance = Number.POSITIVE_INFINITY;

//       for (const strategy of strategies) {
//         const node = sectionRefs.current[strategy.id];
//         if (!node) continue;
//         const nodeCenter = node.offsetLeft + node.clientWidth / 2;
//         const distance = Math.abs(nodeCenter - centerX);
//         if (distance < bestDistance) {
//           bestDistance = distance;
//           bestId = strategy.id;
//         }
//       }

//       if (bestId && bestId !== activeStrategyId) {
//         setActiveStrategyId(bestId);
//       }
//     });
//   }, [activeStrategyId, strategies]);

//   if (isLoading) {
//     return <LoadingState />;
//   }
//   if (error) {
//     return <ErrorState variant="page" message={getUserErrorMessage(error)} />;
//   }

//   if (!playbook) {
//     return (
//       <EmptyState
//         variant="page"
//         title="Playbook not found"
//         message="This playbook doesn't exist or may have been deleted."
//       />
//     );
//   }

//   return (
//     <BeforeUnload disabled={!isDirty}>
//       <header className="header">
//         <div className="row w-full ">
//           <PlaybookCard
//             canEdit={false}
//             hoverDisabled
//             titleTextClassName="text-xl"
//             onNavigate={() => router.push(`/library/playbooks/${playbookId}`)}
//             className="shadow-none border-border py-3"
//             playbook={playbook!}
//           />
//         </div>
//       </header>
//       <div className="secondary-header">
//         <StrategySidebar
//           strategies={strategies}
//           activeStrategyId={activeStrategyId}
//           onStrategyClick={handleSidebarClick}
//         />
//       </div>
//       <div className="container flex-1 min-h-0">
//         <main className="flex-1 min-h-0 flex flex-col gap-4">
//           <div className="ml-auto text-sm text-muted-foreground">
//             {isSaving ? "Saving..." : "All changes saved"}
//           </div>
//           <div
//             ref={editorsScrollRef}
//             onScroll={handleEditorsScroll}
//             className="min-h-0 flex-1 overflow-x-auto overflow-y-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
//           >
//             <div className="flex h-full w-full">
//               {strategies.map((strategy) => (
//                 <div
//                   key={strategy.id}
//                   ref={setSectionRef(strategy.id)}
//                   data-strategy-id={strategy.id}
//                   className="w-full min-w-full shrink-0 snap-start px-1"
//                 >
//                   <StrategyEditorSection
//                     strategy={strategy}
//                     onUpdate={handleUpdateStrategy}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </BeforeUnload>
//   );
// }
