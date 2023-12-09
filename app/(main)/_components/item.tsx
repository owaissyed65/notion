"use client";

import React from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Server,
  Trash,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  onClick: () => void;
  label: string;
  icon: any;
}
const Item = ({
  icon: Icon,
  label,
  onClick,
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) => {
  const router = useRouter();
  const user = useUser();
  const ChevronIcons = expanded ? ChevronDown : ChevronRight;

  const create = useMutation(api.documents.create);
  const archieve = useMutation(api.documents.archieve);

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleInfiniteChild = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then(
      (documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/documents/${documentId}`);
      }
    );
    toast.promise(promise, {
      error: "Some error Occured",
      loading: "Loading...",
      success: "Created new note",
    });
  };
  const handleArchieved = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archieve({ id });
    toast.promise(promise, {
      error: "Some Error Occurred",
      loading: "Loading....",
      success: "Successfully into trash",
    });
  };
  return (
    <div
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      role="button"
      className={cn(
        "group min-h-[27px] temt-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:text-neutral-500 dark:text-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcons className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}

      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span>CTRL+</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all"
                role="button"
              >
                <MoreHorizontal className="h-5 w-6 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={handleArchieved}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-neutral-500 dark:hover:bg-neutral-600 transition-all"
            onClick={handleInfiniteChild}
            role="button"
          >
            <Plus className="w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-[3px]"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;
