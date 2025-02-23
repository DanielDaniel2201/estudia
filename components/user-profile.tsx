'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
interface UserProfileProps {
  avatar: string;
  email: string;
  evaluation: string;
}

export default function UserProfile({ avatar, email, evaluation }: UserProfileProps) {
  return (
    <Card className="w-full max-w-md shadow-lg p-6 relative">
      <Button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4"
        variant="ghost"
      >
        ← Back
      </Button>
      <CardContent className="space-y-6 flex flex-col items-center">
        <Avatar className="size-20 mb-2">
          <AvatarImage src={avatar} alt="User Avatar" />
          <AvatarFallback>ES</AvatarFallback>
        </Avatar>
        <p className="text-base text-black-600">{email}</p>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Evaluation</h3>
          <p className="italic text-base text-gray-600 leading-relaxed mb-3">
            <span className="text-xl">  “</span>{evaluation}<span className="text-xl">”</span>
          </p>
        </div>
      </CardContent>
      <Button
        className="absolute bottom-4 left-2"
        variant="ghost"
      >
        ⚙️ settings
      </Button>
    </Card>
  );
}
