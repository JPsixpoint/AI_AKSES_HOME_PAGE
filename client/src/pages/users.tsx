import React from "react";
import { UserManagement } from "@/components/users/user-management";

export default function UsersPage() {
  return (
    <div className="p-6 bg-dark-lighter h-full overflow-auto">
      <UserManagement />
    </div>
  );
}