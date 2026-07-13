import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Library, Bookmark, UserRound, Plus } from "lucide-react";
import { StrategyRef } from "@/lib/validation";
import { StrategyPickerItem, StrategyPickerSource } from "./";

function keyOf(ref: StrategyRef) {
  return `${ref.sourceType}:${ref.sourceId}`;
}
type StrategyPanelProps = {
  phaseTitle: string;
  systemItems: StrategyPickerItem[];
  savedItems: StrategyPickerItem[];
  userItems: StrategyPickerItem[];
  disabledKeys: string[];
  onPick: (ref: StrategyRef) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function StrategyPanel({
  phaseTitle,
  savedItems,
  userItems,
  systemItems,
  disabledKeys,
  onPick,
  open,
  onOpenChange,
}: StrategyPanelProps) {
  const searchId = `strategy-search-${phaseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}`;
  const [source, setSource] = useState<StrategyPickerSource>("system");

  const sourceItems =
    source === "system"
      ? systemItems
      : source === "saved"
        ? savedItems
        : userItems;
  function addItem(item: StrategyPickerItem) {
    const key = keyOf(item);
    if (disabledKeys.includes(key)) return;
    onPick({ sourceType: item.sourceType, sourceId: item.sourceId });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>Add strategies to {phaseTitle}</SheetTitle>
          <SheetDescription>
            Search and browse by source. Search and bookmark filters are
            placeholders until strategy library features are ready.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={searchId}>Search strategies</FieldLabel>
            </FieldContent>
            <div className="relative">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                id={searchId}
                className="pl-9"
                placeholder="Search strategies"
                type="search"
              />
            </div>
          </Field>

          <Tabs
            value={source}
            onValueChange={(value) => setSource(value as StrategyPickerSource)}
          >
            <TabsList
              className="grid h-auto w-full grid-cols-3"
              aria-label="Strategy source"
            >
              <TabsTrigger value="system">
                <Library aria-hidden="true" />
                PeerPlaybook
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark aria-hidden="true" />
                Saved by you
              </TabsTrigger>
              <TabsTrigger value="user">
                <UserRound aria-hidden="true" />
                Created by you
              </TabsTrigger>
            </TabsList>
            <TabsContent value={source} className="mt-4">
              <div className="grid gap-2">
                {sourceItems.length > 0 ? (
                  sourceItems.map((item) => {
                    const key = keyOf(item);
                    const isAdded = disabledKeys.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        className="border-border bg-background hover:bg-muted focus-visible:border-ring focus-visible:ring-ring/30 flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isAdded}
                        onClick={() => addItem(item)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {item.title}
                          </span>
                          <span className="text-muted-foreground block text-xs">
                            {isAdded ? "Already added" : "Add to this phase"}
                          </span>
                        </span>
                        <Plus aria-hidden="true" />
                      </button>
                    );
                  })
                ) : (
                  <div className="border-border text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                    No strategies are available in this source yet.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
