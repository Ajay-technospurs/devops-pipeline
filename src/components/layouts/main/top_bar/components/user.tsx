"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// User Profile Component
const UserProfile = () => {
  const router = useRouter()
  return(
 
  <div className="px-4">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={"/assets/user.svg"}
          alt={"settings"}
          width={20}
          height={20}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Accounts</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()=>{router.back()}}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
)};
export default UserProfile;
