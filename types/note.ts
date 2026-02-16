//types/note.ts

export const TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export type Tags = (typeof TAGS)[number];

export interface Note {
  id: number;
  title: string;
  content: string;
  tag: Tags;
  createdAt: string;
  updatedAt: string;
}
