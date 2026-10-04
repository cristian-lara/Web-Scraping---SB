import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  FILTER_LESS_OR_EQUAL_5_WORDS_POINTS,
  FILTER_MORE_THAN_5_WORDS_COMMENTS,
  FilterQuerySchema,
  type FilterQuery,
} from "@repo/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFilteredEntries } from "@/lib/api";
import { resultsPanelState } from "@/lib/results-panel-state";
import { listSavedResults, saveFilteredResults } from "@/lib/saved-results";

const SAVED_QUERY_KEY = ["saved-results"] as const;

function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status) {
      return `Request failed (${status}). Try again.`;
    }
    return "Network error. Check the API and try again.";
  }
  return "Something went wrong. Try again.";
}

export function FiltersPage() {
  const [applied, setApplied] = useState<FilterQuery["filter"] | null>(null);
  const queryClient = useQueryClient();
  const form = useForm<FilterQuery>({
    resolver: zodResolver(FilterQuerySchema),
    defaultValues: { filter: FILTER_MORE_THAN_5_WORDS_COMMENTS },
  });

  const query = useQuery({
    queryKey: ["filters", applied],
    queryFn: () => fetchFilteredEntries(applied!),
    enabled: applied !== null,
    retry: false,
  });

  const savedQuery = useQuery({
    queryKey: SAVED_QUERY_KEY,
    queryFn: listSavedResults,
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: saveFilteredResults,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SAVED_QUERY_KEY });
    },
  });

  const panel = resultsPanelState(
    applied === null ? "idle" : query.status,
    query.data,
  );

  const canSave =
    panel === "table" &&
    applied !== null &&
    Array.isArray(query.data) &&
    query.data.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader signedIn />
      <main className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8">
        <form
          className="flex flex-col gap-4 rounded-md border border-border bg-card p-6"
          onSubmit={(event) => {
            void form.handleSubmit((values) => {
              setApplied(values.filter);
              saveMutation.reset();
            })(event);
          }}
          noValidate
        >
          <div>
            <h1 className="font-heading text-xl font-semibold">Filters</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose Filter A or Filter B, then apply. Full list, no pagination.
            </p>
          </div>
          {form.formState.errors.filter ? (
            <p className="text-xs text-destructive" role="alert">
              Select a valid filter.
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex cursor-pointer gap-3 rounded-sm border border-border p-4 has-[:checked]:border-primary">
              <input
                type="radio"
                value={FILTER_MORE_THAN_5_WORDS_COMMENTS}
                {...form.register("filter")}
              />
              <span>
                <span className="block font-heading text-sm font-semibold">
                  Filter A
                </span>
                <span className="text-sm text-muted-foreground">
                  Titles with more than 5 words, sorted by comments
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer gap-3 rounded-sm border border-border p-4 has-[:checked]:border-primary">
              <input
                type="radio"
                value={FILTER_LESS_OR_EQUAL_5_WORDS_POINTS}
                {...form.register("filter")}
              />
              <span>
                <span className="block font-heading text-sm font-semibold">
                  Filter B
                </span>
                <span className="text-sm text-muted-foreground">
                  Titles with 5 words or fewer, sorted by points
                </span>
              </span>
            </label>
          </div>
          <Button type="submit">Apply filter</Button>
        </form>

        <section className="rounded-md border border-border bg-card">
          {panel === "idle" ? (
            <p className="p-8 text-sm text-muted-foreground">
              Apply a filter to load results.
            </p>
          ) : null}
          {panel === "loading" ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              Loading results…
            </div>
          ) : null}
          {panel === "empty" ? (
            <div className="p-12 text-center">
              <p className="font-heading text-lg font-semibold">No entries</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The filter returned an empty list.
              </p>
            </div>
          ) : null}
          {panel === "error" ? (
            <div className="p-12 text-center">
              <p className="font-heading text-lg font-semibold text-destructive">
                Could not load results
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorMessage(query.error)}
              </p>
              <Button
                className="mt-4"
                type="button"
                variant="secondary"
                onClick={() => {
                  void query.refetch();
                }}
              >
                Retry
              </Button>
            </div>
          ) : null}
          {panel === "table" && query.data ? (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  {query.data.length} result{query.data.length === 1 ? "" : "s"}
                </p>
                <div className="flex flex-col items-end gap-1">
                  <Button
                    type="button"
                    disabled={!canSave || saveMutation.isPending}
                    onClick={() => {
                      if (!applied || !query.data) {
                        return;
                      }
                      saveMutation.mutate({
                        filter_applied: applied,
                        entries: query.data,
                      });
                    }}
                  >
                    {saveMutation.isPending ? "Saving…" : "Save results"}
                  </Button>
                  {saveMutation.isError ? (
                    <p className="text-xs text-destructive" role="alert">
                      {errorMessage(saveMutation.error)}
                    </p>
                  ) : null}
                  {saveMutation.isSuccess ? (
                    <p className="text-xs text-muted-foreground">Saved.</p>
                  ) : null}
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>rank</TableHead>
                    <TableHead>title</TableHead>
                    <TableHead className="text-right">points</TableHead>
                    <TableHead className="text-right">comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {query.data.map((entry) => (
                    <TableRow key={`${entry.rank}-${entry.title}`}>
                      <TableCell className="font-mono">{entry.rank}</TableCell>
                      <TableCell>{entry.title}</TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.points}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {entry.comments}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </section>

        <section className="rounded-md border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold">Saved results</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshots you saved. Newest first. No pagination.
          </p>
          {savedQuery.isLoading ? (
            <div className="mt-6 flex items-center gap-2 text-sm">
              <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
              Loading saved results…
            </div>
          ) : null}
          {savedQuery.isError ? (
            <p className="mt-6 text-sm text-destructive" role="alert">
              {errorMessage(savedQuery.error)}
            </p>
          ) : null}
          {savedQuery.isSuccess && savedQuery.data.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No saved results yet. Apply a filter, then use Save results.
            </p>
          ) : null}
          {savedQuery.isSuccess && savedQuery.data.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>savedAt</TableHead>
                  <TableHead>filter</TableHead>
                  <TableHead className="text-right">entryCount</TableHead>
                  <TableHead>id / label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedQuery.data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs">
                      {row.savedAt}
                    </TableCell>
                    <TableCell className="text-xs">{row.filter_applied}</TableCell>
                    <TableCell className="text-right font-mono">
                      {row.entryCount}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.label ?? row.id}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </section>
      </main>
    </div>
  );
}
