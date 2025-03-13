
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import UserRow from "./UserRow";

type User = {
  id: string;
  email: string;
  username: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  roles: string[];
  is_disabled?: boolean;
};

type UserTableProps = {
  users: User[];
  loading: boolean;
  onUserUpdated: () => void;
};

export default function UserTable({ users, loading, onUserUpdated }: UserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} onUserUpdated={onUserUpdated} />
        ))}
        
        {users.length === 0 && !loading && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
