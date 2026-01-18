import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, fetchUser, toggleUserActive } from "@/api/users";
import type { User, UsersQueryParams } from "@/types/user";

export function useUsers(params: UsersQueryParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: ({ signal }) => fetchUsers(params, signal),
  });
}

export function useUser(id: string | null) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id!),
    enabled: !!id,
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserActive,
    onMutate: async (userId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });
      await queryClient.cancelQueries({ queryKey: ["user", userId] });

      // Snapshot the previous values
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      const previousUser = queryClient.getQueryData<User>(["user", userId]);

      // Optimistically update the user in the list
      queryClient.setQueriesData<User[]>(
        { queryKey: ["users"] },
        (old) =>
          old?.map((user) =>
            user.id === userId ? { ...user, active: !user.active } : user
          )
      );

      // Optimistically update the single user
      queryClient.setQueryData<User>(["user", userId], (old) =>
        old ? { ...old, active: !old.active } : old
      );

      return { previousUsers, previousUser, userId };
    },
    onError: (_err, _userId, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueriesData({ queryKey: ["users"] }, context.previousUsers);
      }
      if (context?.previousUser && context?.userId) {
        queryClient.setQueryData(
          ["user", context.userId],
          context.previousUser
        );
      }
    },
    onSettled: (_data, _error, userId) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}
