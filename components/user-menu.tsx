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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button className="
    size-[34px]
    rounded-full 
    bg-background 
    shadow-none 
    border-none 
    outline-none 
    hover:bg-background 
    active:bg-background 
    focus:bg-background
    p-0
    flex items-center justify-center
    hover:scale-105 // 悬停时放大
    transition-transform duration-200 // 平滑过渡
  ">
  <Image
    src={`https://avatar.vercel.sh/${user.email}`}
    alt={user.email ?? 'User Avatar'}
    width={34}
    height={34}
    className="rounded-full"
  />
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