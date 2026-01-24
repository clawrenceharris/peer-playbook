import { DialogContent } from "@/components/ui";
import type { UpdateProfileModalProps } from "@/lib/modals/types";
import { useModal } from "@/app/providers";
import { usePendingMutations } from "@/hooks";
import { EmptyState } from "@/components/states";
import { useProfile } from "../../hooks";
import { UpdateProfileForm } from "../";

export function UpdateProfileModal({
  onConfirm,
  profileId,
}: UpdateProfileModalProps) {
  const { closeModal } = useModal();
  const { data: profile } = useProfile(profileId);
  const { pending: isLoading } = usePendingMutations({
    mutationKey: ["update-profile"],
  });

  return (
    <DialogContent
      title="Edit Profile"
      description="Update your profile information."
      className="max-w-2xl"
    >
      {profile ? (
        <UpdateProfileForm
          defaultValues={{
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            coursesInstructed: profile.coursesInstructed || [],
            avatarUrl: profile.avatarUrl || "",
          }}
          onSuccess={closeModal}
          onCancel={closeModal}
          onSubmit={async (formData) => {
            await onConfirm({
              firstName: formData.firstName,
              lastName: formData.lastName || undefined,
            });
          }}
          isLoading={isLoading}
        />
      ) : (
        <EmptyState
          variant="card"
          title="Profile not found"
          message="Couldn't find the profile to update"
        />
      )}
    </DialogContent>
  );
}
