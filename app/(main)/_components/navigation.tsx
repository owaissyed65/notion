"use client";
import React from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { ElementRef, MouseEvent, useRef } from "react";

export const Navigation = () => {
  const isResizable = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  // for pressing mouse button
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    isResizable.current = true;
    // @ts-ignore
    document?.addEventListener("mousemove", handleMouseMove);
    // @ts-ignore
    document?.addEventListener("mouseup", handleMouseUp);
  };
  // for moving mouse
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizable.current) return;
    let clientX = e.clientX;
    if (clientX < 240) clientX = 240;
    if (clientX > 480) clientX = 480;
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${clientX}px`;
    }
  };
  // for release mouse button
  const handleMouseUp = (e: MouseEvent) => {
    isResizable.current = false;
    // @ts-ignore
    document?.removeEventListener("mousemove", handleMouseMove);
    // @ts-ignore
    document?.removeEventListener("mouseup", handleMouseUp);
  };
  const handleSidebarControl = () => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.width = "240px";
  };
  return (
    <>
      <aside
        ref={sidebarRef}
        className="group/sidebar h-full flex flex-col w-60 bg-secondary overflow-y-auto relative z-[99999]
        transition-all ease-in-out
      "
      >
        <div
          className="absolute opacity-0 top-1 right-1 group-hover/sidebar:opacity-100 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
          onClick={handleSidebarControl}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <p>Action Item</p>
        </div>
        <div className="mt-4">
          <p>Documents</p>
        </div>
        <div
          className="opacity-0 group-hover/sidebar:opacity-100 transition absolute top-0 h-full w-1 right-0 cursor-ew-resize bg-primary/10"
          onMouseDown={handleMouseDown}
          onClick={() => {}}
        />
      </aside>
      <div ref={navbarRef}></div>
    </>
  );
};
