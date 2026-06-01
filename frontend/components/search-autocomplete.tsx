"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { matchQuerySuggestions } from "@/lib/query-suggestions";
import { getSearchHistory } from "@/lib/search-history";
import { cn } from "@/lib/utils";
import { Clock, Search } from "lucide-react";

interface SearchAutocompleteProps {
  query: string;
  onQueryChange: (value: string) => void;
  onQueryPick?: (value: string) => void;
  inputId: string;
  placeholder: string;
  className?: string;
  inputClassName?: string;
  labelledBy?: string;
}

export const SearchAutocomplete = forwardRef<
  HTMLInputElement,
  SearchAutocompleteProps
>(function SearchAutocomplete(
  {
    query,
    onQueryChange,
    onQueryPick,
    inputId,
    placeholder,
    className,
    inputClassName,
    labelledBy,
  },
  ref
) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = matchQuerySuggestions(query, 5);
  const showHistory = open && !query.trim() && history.length > 0;
  const showSuggestions = open && query.trim().length > 0 && suggestions.length > 0;
  const items = showHistory ? history : showSuggestions ? suggestions : [];
  const showDropdown = showHistory || showSuggestions;

  useEffect(() => {
    if (open) setHistory(getSearchHistory());
  }, [open]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, showDropdown]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const pick = (value: string) => {
    onQueryChange(value);
    onQueryPick?.(value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < items.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      pick(items[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        ref={ref}
        id={inputId}
        type="search"
        role="searchbox"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className={inputClassName}
        autoComplete="off"
        aria-labelledby={labelledBy}
      />
      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-popover py-1 shadow-md"
        >
          {showHistory && (
            <li className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Recent searches
            </li>
          )}
          {showSuggestions && !showHistory && (
            <li className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Suggestions
            </li>
          )}
          {items.map((item, index) => (
            <li key={`${showHistory ? "h" : "s"}-${item}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={cn(
                  "focus-ring flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                  index === activeIndex && "bg-muted"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                {showHistory ? (
                  <Clock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                ) : (
                  <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className="truncate">{item}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
