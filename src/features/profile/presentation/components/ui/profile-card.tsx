import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui";
import { ProfileCardDTO } from "@/features/profile/application/dto";
import { MessageCircle } from "lucide-react";

type ProfileCardProps = {
  profile: ProfileCardDTO;
  encounterCount: number;
} & React.ComponentProps<typeof Card>;
export function ProfileCard({ profile, encounterCount = 0 }: ProfileCardProps) {
  return (
    <Card className="w-full min-w-[330px] bg-transparent shadow-none">
      <CardHeader>
        <Avatar className="size-17">
          <AvatarImage src={profile.avatarUrl ?? undefined} />
          <AvatarFallback>{profile.initials}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="font-heading text-lg font-medium">
          {profile.displayName}
        </p>

        <span className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-[999] px-5 py-1 text-sm">
          <MessageCircle strokeWidth={2.5} className="size-4" />
          {encounterCount} {encounterCount === 1 ? "encounter" : "encounters"}
        </span>
      </CardContent>
    </Card>
  );
}
