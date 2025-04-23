"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoriesManagement from "@/components/categories-management";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Управление категориями</h1>
      </div>

      <CategoriesManagement />
    </div>
  );
}
