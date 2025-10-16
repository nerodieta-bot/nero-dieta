
import { LoginPhoneForm } from "@/components/login-phone-form";
import { Phone } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

export default function LoginPhonePage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        <Button asChild variant="ghost" className="absolute -top-12 left-0 text-muted-foreground">
            <Link href="/login">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Wróć
            </Link>
        </Button>
        <LoginPhoneForm />
      </div>
    </div>
  );
}
