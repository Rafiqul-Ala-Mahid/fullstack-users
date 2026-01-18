import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { Role } from "@/types/user";

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: Role | "";
  onRoleChange: (value: Role | "") => void;
}

export function SearchFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
}: SearchFiltersProps) {
  return (
    <div className="flex gap-4 p-4 bg-white border-b border-gray-200">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={role}
        onChange={(e) => onRoleChange(e.target.value as Role | "")}
        className="w-40"
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </Select>
    </div>
  );
}
