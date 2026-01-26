import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile as updateProfileAPI } from "../../services/apiProfile";
import toast from "react-hot-toast";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: (data) => {
      toast.success("Profile Updated");
      queryClient.setQueryData(["profile", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateProfile, isUpdating };
}
