// app/@modal/(.)notes/[id]/page.tsx

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "@/app/notes/[id]/NoteDetails.client";

export default async function NoteDetailsPageModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const queryClient = new QueryClient();
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  await queryClient.prefetchQuery({
    queryKey: ["note", resolvedParams.id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
