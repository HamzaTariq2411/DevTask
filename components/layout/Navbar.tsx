"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-md p-4 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Shadcn</Link>
        </div>
        <div>
          <Button asChild variant="default">
            <Link href="/admin">Dashboard</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}