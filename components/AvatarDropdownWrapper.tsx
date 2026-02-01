
import { getCurrentUser } from "@/lib/get-user";
import { AvatarDropdown } from "./AvatarDropDown";


export async function AvatarDropdownWrapper() {
  const user = await getCurrentUser();

  return <AvatarDropdown user={user} />;
}