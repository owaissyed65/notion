"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "convex/react";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Item from "./item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentList {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const DocumentList = ({ parentDocumentId, level = 0 }: DocumentList) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.sidebarGet, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };
  
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      <p
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80 text-center",
          expanded && "last:block",
          level === 0 && "hidden"
        )}
      >
        No Pages Inside
      </p>
      {documents?.map((document) => (
        <div key={document?._id}>
          <Item
            id={document?._id}
            onClick={() => onRedirect(document?._id)}
            label={document?.title}
            icon={FileIcon}
            documentIcon={document?.icon}
            active={params?.documentId === document?._id}
            expanded={expanded[document?._id]}
            level={level}
            onExpand={() => onExpand(document?._id)}
          />
          {expanded[document?._id] && (
            <DocumentList parentDocumentId={document?._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;

// logic is here that
/**
 * first it render document list where we hidden no pages here and it only be exess by expand state
 *
 */
