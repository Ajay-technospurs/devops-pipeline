import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import {  LogOut } from 'lucide-react';
import Image from "next/image";

// User Profile Component
const UserProfile = () => (
    <div className="px-4">
    <DropdownMenu >
      <DropdownMenuTrigger asChild >
      <Image src={"/assets/user.svg"} alt={"settings"} width={28} height={28} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
  export default UserProfile;