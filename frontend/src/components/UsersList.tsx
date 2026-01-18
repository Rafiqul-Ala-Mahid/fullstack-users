import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface UsersListProps {
  users: User[] | undefined;
  isLoading: boolean;
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}

export function UsersList({
  users,
  isLoading,
  selectedUserId,
  onSelectUser,
}: UsersListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={cn(
            "w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors",
            selectedUserId === user.id && "bg-gray-100"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <div className="flex gap-2 mt-1">
              <Badge variant={user.role as "admin" | "editor" | "viewer"}>
                {user.role}
              </Badge>
              <Badge variant={user.active ? "active" : "inactive"}>
                {user.active ? "active" : "inactive"}
              </Badge>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
