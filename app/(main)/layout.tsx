"use client";
import React from "react";
import { useRouter } from "next/navigation";

import { useConvexAuth } from "convex/react";

import { Spinner } from "@/components/spinner";
import { Navigation } from "./_components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }
  if (!isAuthenticated) {
    return router.push("/");
  }
  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="w-full">{children}</main>
    </div>
  );
};

export default MainLayout;
