import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserPreferences, UserPreferencesUpdate } from "@recipe/shared";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8787/api/v1";

async function fetchPreferences(): Promise<UserPreferences> {
  const res = await fetch(`${API_BASE}/user/preferences`, {
    credentials: "include",
  });
  if (!res.ok) {
    if (res.status === 404) {
      return {};
    }
    throw new Error(`Failed to fetch preferences: ${res.status}`);
  }
  return await res.json();
}

async function updatePreferences(data: UserPreferencesUpdate): Promise<UserPreferences> {
  const res = await fetch(`${API_BASE}/user/preferences`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update preferences: ${res.status}`);
  }
  return await res.json();
}

export const preferencesQueryKey = ["user", "preferences"] as const;

export function usePreferences() {
  return useQuery({
    queryKey: preferencesQueryKey,
    queryFn: fetchPreferences,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: preferencesQueryKey });
      const previous = queryClient.getQueryData<UserPreferences>(preferencesQueryKey);

      queryClient.setQueryData<UserPreferences>(preferencesQueryKey, (old) => ({
        ...old,
        ...newData,
      }));

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(preferencesQueryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: preferencesQueryKey });
    },
  });
}
