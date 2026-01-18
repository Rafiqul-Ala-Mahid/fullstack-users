import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types/user";

interface UserDetailsProps {
  user: User | undefined;
  isLoading: boolean;
  viewingSeconds: number;
  onToggleActive: () => void;
  isToggling: boolean;
}

export function UserDetails({
  user,
  isLoading,
  viewingSeconds,
  onToggleActive,
  isToggling,
}: UserDetailsProps) {
  if (!user && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a user to view details</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{user!.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg">{user!.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <Badge
              variant={user!.role as "admin" | "editor" | "viewer"}
              className="mt-1"
            >
              {user!.role.charAt(0).toUpperCase() + user!.role.slice(1)}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge
              variant={user!.active ? "active" : "inactive"}
              className="mt-1"
            >
              {user!.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created At</p>
            <p className="text-lg">
              {new Date(user!.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span className="font-medium">Bonus</span>
          </div>
          <p className="mt-2 text-amber-700">
            Viewing profile for{" "}
            <span className="font-semibold">{viewingSeconds}</span> seconds
          </p>
        </div>

        <Button
          onClick={onToggleActive}
          disabled={isToggling}
          variant={user!.active ? "destructive" : "default"}
        >
          {isToggling
            ? "Updating..."
            : user!.active
            ? "Deactivate User"
            : "Activate User"}
        </Button>
      </CardContent>
    </Card>
  );
}
