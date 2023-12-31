"use client";
import React, {
  useState,
  ElementRef,
  MouseEvent,
  useRef,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";

import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils";

import { api } from "@/convex/_generated/api";

import UserItem from "./user-item";
import Item from "./item";
import DocumentList from "./document-list";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const Navigation = () => {
  // for path
  const pathName = usePathname();
  // for mobile checking
  const isMobile = useMediaQuery("(max-width: 768px)");
  // all reference
  const isResizable = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  // queries

  const create = useMutation(api.documents.create);

  // all states
  const [isResetting, setResetting] = useState<Boolean>(false);
  const [isCollapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      handleSidebarControl();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [isMobile, pathName]);

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
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${clientX}px`;
      navbarRef.current.style.setProperty("left", `${clientX}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${clientX}px)`);
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

  // for handlingsidebar Control
  const handleSidebarControl = () => {
    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(false);
      setResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setResetting(false), 300);
    }
  };

  // for collapsing
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setCollapsed(true);
      setResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setResetting(false), 300);
    }
  };

  const onCreate = () => {
    const promise = create({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note Created",
      error: "Some error occured on creating",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
          onClick={collapse}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <UserItem />
          <Item onClick={() => {}} label="Search" isSearch icon={Search} />
          <Item onClick={() => {}} label="Settings" icon={Settings} />
          <Item onClick={onCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item onClick={onCreate} label="Add A New Page" icon={PlusCircle} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} onClick={() => {}} />
            </PopoverTrigger>
            <PopoverContent side={!isMobile?"right":"bottom"} className="p-0 w-72">
              <p>Trash Box</p>
            </PopoverContent>
          </Popover>
        </div>
        <div
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
          onMouseDown={handleMouseDown}
          onClick={handleSidebarControl}
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav
          className="bg-transparent px-3 py-2 w-full"
          onClick={handleSidebarControl}
        >
          {isCollapsed && (
            <MenuIcon role="button" className="h-6 w-6 text-muted-foreground" />
          )}
        </nav>
      </div>
    </>
  );
};
