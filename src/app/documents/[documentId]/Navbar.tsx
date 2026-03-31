"use client";
import Link from "next/link";
import { 
  FileIcon, 
  FilePlusIcon, 
  FolderOpenIcon, 
  CopyIcon, 
  Share2Icon, 
  MailIcon, 
  DownloadIcon, 
  Edit3Icon, 
  FolderIcon, 
  ExternalLinkIcon, 
  TrashIcon, 
  HistoryIcon, 
  CloudIcon, 
  InfoIcon, 
  LanguagesIcon, 
  SettingsIcon, 
  PrinterIcon,
  Undo2Icon,
  Redo2Icon,
  ScissorsIcon,
  ClipboardIcon,
  SearchIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  MessageSquarePlusIcon,
  Link2Icon,
  TableIcon,
  ImageIcon,
  PlusIcon,
  SquareIcon,
  BarChartIcon,
  MinusIcon,
  SmileIcon,
  TypeIcon,
  SpellCheckIcon,
  HelpCircleIcon,
  MessageSquareIcon,
  KeyboardIcon
} from "lucide-react";

import { useEditorStore } from "@/store/use-editor-store";
import { DocumentInput } from "./document-input";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export const Navbar = () => {
  const { editor } = useEditorStore();

  const insertTable = ({ rows, cols }: { rows: number, cols: number }) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSaveJSON = () => {
    if (!editor) return;
    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], { type: "application/json" });
    onDownload(blob, "document.json");
  };

  const onSaveHTML = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    onDownload(blob, "document.html");
  };

  const onSaveText = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    onDownload(blob, "document.txt");
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/">
          <img src="/logo.svg" alt="Logo" className="h-8" />
        </Link>
        <div className="flex flex-col">
          <DocumentInput />
          <div className="flex">
            <Menubar className="border-none shadow-none bg-transparent h-auto p-0">
              {/* FILE MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">File</MenubarTrigger>
                <MenubarContent className="print:hidden">
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <PlusIcon className="size-4 mr-2" />
                      New
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => window.open('/documents/new', '_blank')}>
                        <FilePlusIcon className="size-4 mr-2" />
                        Document
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem>
                    <FolderOpenIcon className="size-4 mr-2" />
                    Open
                    <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <CopyIcon className="size-4 mr-2" />
                    Make a copy
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Share2Icon className="size-4 mr-2" />
                    Share
                  </MenubarItem>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <MailIcon className="size-4 mr-2" />
                      Email
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email this file</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <DownloadIcon className="size-4 mr-2" />
                      Download
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={onSaveHTML}>
                        PDF Document (.pdf) (not implemented)
                      </MenubarItem>
                      <MenubarItem onClick={onSaveHTML}>
                        HTML (.html)
                      </MenubarItem>
                      <MenubarItem onClick={onSaveJSON}>
                        JSON (.json)
                      </MenubarItem>
                      <MenubarItem onClick={onSaveText}>
                        Plain Text (.txt)
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    <Edit3Icon className="size-4 mr-2" />
                    Rename
                  </MenubarItem>
                  <MenubarItem>
                    <FolderIcon className="size-4 mr-2" />
                    Move
                  </MenubarItem>
                  <MenubarItem>
                    <ExternalLinkIcon className="size-4 mr-2" />
                    Add shortcut to Drive
                  </MenubarItem>
                  <MenubarItem>
                    <TrashIcon className="size-4 mr-2" />
                    Move to trash
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <HistoryIcon className="size-4 mr-2" />
                    Version history
                  </MenubarItem>
                  <MenubarItem>
                    <CloudIcon className="size-4 mr-2" />
                    Make available offline
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <InfoIcon className="size-4 mr-2" />
                    Details
                  </MenubarItem>
                  <MenubarItem>
                    <LanguagesIcon className="size-4 mr-2" />
                    Language
                  </MenubarItem>
                  <MenubarItem>
                    <SettingsIcon className="size-4 mr-2" />
                    Page setup
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => window.print()}>
                    <PrinterIcon className="size-4 mr-2" />
                    Print
                    <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* EDIT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo2Icon className="size-4 mr-2" />
                    Undo
                    <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo2Icon className="size-4 mr-2" />
                    Redo
                    <MenubarShortcut>⌘Y</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <ScissorsIcon className="size-4 mr-2" />
                    Cut
                    <MenubarShortcut>⌘X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <CopyIcon className="size-4 mr-2" />
                    Copy
                    <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <ClipboardIcon className="size-4 mr-2" />
                    Paste
                    <MenubarShortcut>⌘V</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <ClipboardIcon className="size-4 mr-2" />
                    Paste without formatting
                    <MenubarShortcut>⌘⇧V</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => editor?.chain().focus().selectAll().run()}>
                    Select all
                    <MenubarShortcut>⌘A</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <SearchIcon className="size-4 mr-2" />
                    Find and replace
                    <MenubarShortcut>⌘H</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* VIEW MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Show print layout
                  </MenubarItem>
                  <MenubarItem>
                    Show ruler
                  </MenubarItem>
                  <MenubarItem>
                    Show outline
                  </MenubarItem>
                  <MenubarItem>
                    Show equation toolbar
                  </MenubarItem>
                  <MenubarItem>
                    Show non-printing characters
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Full screen
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* INSERT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Insert</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <ImageIcon className="size-4 mr-2" />
                      Image
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Upload from computer</MenubarItem>
                      <MenubarItem>Search the web</MenubarItem>
                      <MenubarItem>Drive</MenubarItem>
                      <MenubarItem>Photos</MenubarItem>
                      <MenubarItem>By URL</MenubarItem>
                      <MenubarItem>Camera</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TableIcon className="size-4 mr-2" />
                      Table
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 3, cols: 3 })}>3 x 3</MenubarItem>
                      <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <SquareIcon className="size-4 mr-2" />
                      Drawing
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>New</MenubarItem>
                      <MenubarItem>From Drive</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarSub>
                    <MenubarSubTrigger>
                      <BarChartIcon className="size-4 mr-2" />
                      Chart
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Bar</MenubarItem>
                      <MenubarItem>Column</MenubarItem>
                      <MenubarItem>Line</MenubarItem>
                      <MenubarItem>Pie</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>From Sheets</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>

                  <MenubarItem>
                    <MinusIcon className="size-4 mr-2" />
                    Horizontal line
                  </MenubarItem>
                  <MenubarItem>
                    <SmileIcon className="size-4 mr-2" />
                    Emoji
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => editor?.chain().focus().setLink({ href: "" }).run()}>
                    <Link2Icon className="size-4 mr-2" />
                    Link
                    <MenubarShortcut>⌘K</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    <MessageSquarePlusIcon className="size-4 mr-2" />
                    Comment
                    <MenubarShortcut>⌘⌥M</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* FORMAT MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Format</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>
                      <TypeIcon className="size-4 mr-2" />
                      Text
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
                        <BoldIcon className="size-4 mr-2" />
                        Bold
                        <MenubarShortcut>⌘B</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
                        <ItalicIcon className="size-4 mr-2" />
                        Italic
                        <MenubarShortcut>⌘I</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                        <UnderlineIcon className="size-4 mr-2" />
                        Underline
                        <MenubarShortcut>⌘U</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
                        <StrikethroughIcon className="size-4 mr-2" />
                        Strikethrough
                        <MenubarShortcut>⌘⇧X</MenubarShortcut>
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                    Clear formatting
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* TOOLS MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Tools</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <SpellCheckIcon className="size-4 mr-2" />
                    Spelling and grammar
                  </MenubarItem>
                  <MenubarItem>
                    Word count
                    <MenubarShortcut>⌘⇧C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Dictionary
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Voice typing
                    <MenubarShortcut>⌘⇧S</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* EXTENSIONS MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Extensions</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Add-ons
                  </MenubarItem>
                  <MenubarItem>
                    Apps Script
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {/* HELP MENU */}
              <MenubarMenu>
                <MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto">Help</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    <HelpCircleIcon className="size-4 mr-2" />
                    Help
                  </MenubarItem>
                  <MenubarItem>
                    Training
                  </MenubarItem>
                  <MenubarItem>
                    Updates
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <MessageSquareIcon className="size-4 mr-2" />
                    Help Docs improve
                  </MenubarItem>
                  <MenubarItem>
                    Report abuse/copyright
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    <KeyboardIcon className="size-4 mr-2" />
                    Keyboard shortcuts
                    <MenubarShortcut>⌘/</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      </div>
    </nav>
  );
};

