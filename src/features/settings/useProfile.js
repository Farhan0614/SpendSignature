import { useQuery } from "@tanstack/react-query";
import { useUser } from "../authentication/useUser";
import { getProfile } from "../../services/apiProfile";

export function useProfile() {
  const { user } = useUser();
  // Fetch profile using the user.id from Auth
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user.id),
    enabled: !!user,
  });

  return { profile, isLoading };
}
