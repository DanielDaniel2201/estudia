'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDownIcon } from './icons';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
export function UserMenu({
  user,
}: {
  user: User
} & React.ComponentProps<typeof Button>) {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  console.log("&&&&&&&&&& user ");
  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="
          hover:bg-gray-100
          data-[state=open]:bg-sidebar-accent
          bg-background
          data-[state=open]:text-sidebar-accent-foreground
          h-10
          border border-gray-200
        ">
          <Image
            src={`https://avatar.vercel.sh/${user.email}`}
            alt={user.email ?? 'User Avatar'}
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="truncate text-black">{user?.email}</span>
          <ChevronDownIcon />

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full cursor-pointer"
            onClick={() => {
              const userId = user.id;
              router.push(`/user/${userId}`);
            }}
          >
            Profile
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="w-full cursor-pointer"
            onClick={() => {
              signOut({
                redirectTo: '/',
              });
            }}
          >
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}