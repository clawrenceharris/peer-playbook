"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export type SearchBarProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  /** Controlled value. If omitted, the SearchBar is uncontrolled. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the next value string. */
  onChange?: (value: string) => void;
  /** Called when the clear button is pressed (in addition to onChange("")). */
  onClear?: () => void;

  /** Optional controlled expansion state. */
  expanded?: boolean;
  /** Called when expanded state changes (click/focus/outside/Escape). */
  onExpandedChange?: (expanded: boolean) => void;

  /** Wrapper classes (controls width + transition). */
  containerClassName?: string;
  /** InputGroup classes. */
  className?: string;
  /** Input element classes. */
  inputClassName?: string;

  /** Tailwind width classes for collapsed/expanded states. */
  collapsedWidthClassName?: string;
  expandedWidthClassName?: string;

  /** If true, outside click collapses the bar. */
  collapseOnOutsideClick?: boolean;
  /** If true, Escape collapses and blurs the input. */
  collapseOnEscape?: boolean;
};

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onClear,
      expanded,
      onExpandedChange,
      containerClassName,
      className,
      inputClassName,
      collapsedWidthClassName = "w-40",
      expandedWidthClassName = "w-96",
      collapseOnOutsideClick = true,
      collapseOnEscape = true,
      placeholder = "Search…",
      disabled,
      readOnly,
      ...inputProps
    },
    forwardedRef
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const isValueControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? ""
    );
    const currentValue = isValueControlled ? value : uncontrolledValue;

    const isExpandedControlled = expanded !== undefined;
    const [uncontrolledExpanded, setUncontrolledExpanded] =
      React.useState(false);
    const isExpanded = isExpandedControlled ? expanded : uncontrolledExpanded;

    const setExpandedState = React.useCallback(
      (next: boolean) => {
        if (!isExpandedControlled) setUncontrolledExpanded(next);
        onExpandedChange?.(next);
      },
      [isExpandedControlled, onExpandedChange]
    );

    const setValueState = React.useCallback(
      (next: string) => {
        if (!isValueControlled) setUncontrolledValue(next);
        onChange?.(next);
      },
      [isValueControlled, onChange]
    );

    const focusInput = React.useCallback(() => {
      inputRef.current?.focus();
    }, []);

    const clear = React.useCallback(() => {
      if (disabled || readOnly) return;
      setValueState("");
      onClear?.();
      focusInput();
    }, [disabled, readOnly, setValueState, onClear, focusInput]);

    useOnClickOutside(
      containerRef,
      () => {
        if (!collapseOnOutsideClick) return;
        setExpandedState(false);
      },
      "mousedown"
    );

    return (
      <div
        ref={containerRef}
        data-slot="search-bar"
        className={cn(
          "max-w-full transition-[width] duration-200 ease-in-out",
          isExpanded ? expandedWidthClassName : collapsedWidthClassName,
          containerClassName
        )}
        onPointerDownCapture={(e) => {
          if (disabled) return;
          // Expand on any click inside, and ensure the input receives focus.
          setExpandedState(true);
          // Only force focus if they didn't click directly into the input already.
          if (
            (e.target as HTMLElement | null)?.tagName?.toLowerCase() !== "input"
          ) {
            queueMicrotask(focusInput);
          }
        }}
        onFocusCapture={() => {
          if (disabled) return;
          setExpandedState(true);
        }}
      >
        <InputGroup className={cn("w-full", className)} data-disabled={disabled}>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Search />
            </InputGroupText>
          </InputGroupAddon>

          <InputGroupInput
            {...inputProps}
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            type="search"
            value={currentValue}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            className={cn("min-w-0", inputClassName)}
            onChange={(e) => setValueState(e.target.value)}
            onKeyDown={(e) => {
              inputProps.onKeyDown?.(e);
              if (e.defaultPrevented) return;
              if (collapseOnEscape && e.key === "Escape") {
                e.currentTarget.blur();
                setExpandedState(false);
              }
            }}
          />

          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Clear search"
              title="Clear"
              disabled={disabled || readOnly || !currentValue}
              onClick={(e) => {
                e.preventDefault();
                clear();
              }}
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

