// lib/api.ts

import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";

export interface FetchNotesParams {
  query?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type PaginatedNotes = {
  pages: FetchNotesResponse[];
};

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: string;
}

export type UpdateNoteParams = {
  id: string;
} & Partial<CreateNoteParams>;

const API_URL = "https://notehub-public.goit.study/api/notes";

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/json",
  },
});

export async function fetchNotes({
  query,
  page = 1,
  perPage = 12,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  try {
    const params: { [key: string]: number | string | undefined } = {
      page,
      perPage,
      sortBy: "created",
    };

    if (query && query.trim().length > 0) {
      params.search = query;
    }

    if (tag && tag !== undefined) {
      params.tag = tag;
    }

    const response: AxiosResponse<FetchNotesResponse> = await api.get("", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : "Unknown Error"}`,
    );
  }
}

export async function createNote(data: CreateNoteParams): Promise<Note> {
  try {
    const response: AxiosResponse<Note> = await api.post("", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : "Unknown Error"}`,
    );
  }
}

export async function updateNote(data: UpdateNoteParams): Promise<Note> {
  try {
    const { id, ...patchData } = data;
    const response: AxiosResponse<Note> = await api.patch(
      `/${id}`,
      patchData,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : "Unknown Error"}`,
    );
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const response: AxiosResponse<Note> = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : "Unknown Error"}`,
    );
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  try {
    const response: AxiosResponse<Note> = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error: ${error instanceof Error ? error.message : "Unknown Error"}`,
    );
  }
}
