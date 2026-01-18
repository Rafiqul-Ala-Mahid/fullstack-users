import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchFilters } from "@/components/SearchFilters";
import { UsersList } from "@/components/UsersList";
import { UserDetails } from "@/components/UserDetails";
import { SortButton, type SortDirection } from "@/components/SortButton";
import { useUsers, useUser, useToggleUserActive } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/useDebounce";
import { useViewingTimer } from "@/hooks/useViewingTimer";
import type { Role } from "@/types/user";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function Dashboard() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");

  // Debounce search for query cancellation
  const debouncedSearch = useDebounce(search, 300);

  // Fetch users with search and role filter
  const {
    data: users,
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useUsers({
    search: debouncedSearch || undefined,
    role: role || undefined,
  });

  // Fetch selected user details
  const { data: selectedUser, isLoading: isLoadingUser } = useUser(selectedUserId);

  // Toggle active mutation
  const toggleActiveMutation = useToggleUserActive();

  // Viewing timer
  const viewingSeconds = useViewingTimer(selectedUserId);

  // Sort users locally
  const sortedUsers = useMemo(() => {
    if (!users || sortDirection === "none") return users;

    return [...users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [users, sortDirection]);

  const handleToggleActive = () => {
    if (selectedUserId) {
      toggleActiveMutation.mutate(selectedUserId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Users Dashboard</h1>
      </header>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
      />

      <div className="flex">
        {/* Left Panel - Users List */}
        <div className="w-1/3 min-w-[300px] max-w-[400px] border-r border-gray-200 bg-white min-h-[calc(100vh-130px)]">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Users List</h2>
            <SortButton
              direction={sortDirection}
              onChange={setSortDirection}
              disabled={isLoadingUsers || isFetchingUsers}
            />
          </div>
          <UsersList
            users={sortedUsers}
            isLoading={isLoadingUsers}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>

        {/* Right Panel - User Details */}
        <div className="flex-1 p-6">
          <UserDetails
            user={selectedUser}
            isLoading={isLoadingUser}
            viewingSeconds={viewingSeconds}
            onToggleActive={handleToggleActive}
            isToggling={toggleActiveMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
