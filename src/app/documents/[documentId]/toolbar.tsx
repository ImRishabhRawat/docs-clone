"use client";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  Bold,
  ChevronDown,
  Italic,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  Underline,
  Undo2Icon,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" }, // Note: Normal text is usually 16px, not 12px!
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
    { label: "Heading 5", value: 5, fontSize: "16px" },
    { label: "Heading 6", value: 6, fontSize: "14px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 6; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };

  // 1. ADDED THE REQUIRED `return` KEYWORD HERE
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
            )}
          />
        }
      >
        <span className="truncate">
          {getCurrentHeading()}
        </span>
        <ChevronDown className="ml-4 size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <DropdownMenuItem
            key={value}
            // 2. ADDED onClick SO IT ACTUALLY APPLIES THE HEADING
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor?.chain().focus().toggleHeading({ level: value as any }).run();
              }
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 cursor-pointer",
              ((value === 0 && !editor?.isActive("heading")) || 
              editor?.isActive("heading", { level: value })) && "bg-neutral-200/80"
            )}
            style={{ fontSize }}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ); // 3. Don't forget to close the return block!
};

const FontFamilyButton = () => {
  const {editor} = useEditorStore();

  const fonts = [
    {label: "Arial", value: "Arial"},
    {label: "Verdana", value: "Verdana"},
    {label: "Times New Roman", value: "Times New Roman"},
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
            )}
          />
        }
      >
        <span className="truncate">
          {editor?.getAttributes("textStyle").fontFamily || "Arial"}
        </span>
        <ChevronDown className="ml-4 size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm",
              editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();

  // 1. Explicitly track ALL active states in React
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    taskList: false, // Added this so your to-do list button works correctly!
  });

  // 2. Sync Tiptap's state with React's state
  useEffect(() => {
    if (!editor) return;

    // This function checks what is currently active and updates React state
    const updateActiveStates = () => {
      setActiveFormats({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        taskList: editor.isActive("taskList"),
      });
    };

    // Run it once immediately to set initial state
    updateActiveStates();

    // Listen to BOTH transaction (typing/formatting) and selectionUpdate (clicking around)
    editor.on("transaction", updateActiveStates);
    editor.on("selectionUpdate", updateActiveStates);

    return () => {
      editor.off("transaction", updateActiveStates);
      editor.off("selectionUpdate", updateActiveStates);
    };
  }, [editor]);

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run(),
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const dom = editor?.view?.dom;
          if (!dom) return;

          const current = dom.getAttribute("spellcheck");
          dom.setAttribute(
            "spellcheck",
            current === "false" ? "true" : "false"
          );
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: Bold,
        onClick: () => editor?.chain().focus().toggleBold().run(),
        isActive: activeFormats.bold, 
      },
      {
        label: "Italic",
        icon: Italic,
        onClick: () => editor?.chain().focus().toggleItalic().run(),
        isActive: activeFormats.italic,
      },
      {
        label: "Underline",
        icon: Underline,
        onClick: () => editor?.chain().focus().toggleUnderline().run(),
        isActive: activeFormats.underline,
      }
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        isActive: false, // TODO: Implement comment functionality
      },
       {
        label: "List Todo",
        icon: ListTodoIcon,
        onClick: () => editor?.chain().focus().toggleTaskList().run(),
        isActive: activeFormats.taskList, // Updated to use tracked state
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => editor?.chain().focus().unsetAllMarks().run(),
        // Removed `isActive` here, as removing formats isn't a toggled state
      },
    ]
  ];

  return (
    <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {/* Font Family  */}
      <FontFamilyButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {/* Headings  */}
      <HeadingLevelButton />
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {/* Font Size  */}
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {/* text color  */}
      {/* highlight color */}
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {/* link  */}
      {/* image  */}
      {/* align */}
      {/* line height */}
      {/* list  */}
       {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};