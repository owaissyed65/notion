"use client";
import Image from "next/image";
import React from "react";

import { PlusCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

const DocumentPage = () => {
  const create = useMutation(api.documents.create);
  const { user } = useUser();

  const onCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      console.log(documentId)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };
  return (
    <div className="h-full flex flex-col justify-center items-center space-y-4">
      <Image
        src={"/empty.png"}
        alt="Empty"
        width={"300"}
        height={"300"}
        className="dark:hidden"
      />
      <Image
        src={"/empty-dark.png"}
        alt="Empty"
        width={"300"}
        height={"300"}
        className="dark:block hidden"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentPage;
