import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  backUrl?: string;
}

export default function MobileHeader({ title, backUrl }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex items-center h-14 px-4 max-w-md mx-auto">
        {backUrl && (
          <Link href={backUrl}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Назад</span>
            </Button>
          </Link>
        )}
        <h1 className="font-semibold">{title}</h1>
        <Link
          href="/admin"
          className="ml-auto rounded-lg p-2 bg-black text-white"
        >
          Админ
        </Link>
      </div>
    </header>
  );
}
