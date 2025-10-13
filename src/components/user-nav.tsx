'use client';

import { useUser } from '@/firebase/provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { signOutAction } from '@/app/login/actions';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/');
  };

  if (!user) return null;

  const getInitials = (email: string | null) => {
    if (!email) return '?';
    return email[0].toUpperCase();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-accent/50">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.email || 'User'} />}
            <AvatarFallback className="bg-accent text-accent-foreground font-bold">
              {getInitials(user.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Mój profil</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Wyloguj się</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
