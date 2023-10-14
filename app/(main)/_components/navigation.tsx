"use client";

import { ChevronsLeft } from "lucide-react";
import { ElementRef, MouseEvent, useRef } from "react";

export const Navigation = () => {
  return (
    <>
      <aside
        className="group/sidebar h-full flex flex-col w-60 bg-secondary overflow-y-auto relative z-[99999]
      "
      >
        <div className="absolute opacity-0 top-1 right-1 group-hover/sidebar:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition">
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <p>Action Item</p>
        </div>
        <div className="mt-4">
          <p>Documents</p>
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition absolute top-0 h-full w-1 right-0 cursor-ew-resize bg-primary/10" />
      </aside>
    </>
  );
};
