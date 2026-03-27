"use client";
import { useState, useEffect } from "react";
import { type ColorResult, SketchPicker } from "react-color";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  ChevronDown,
  Highlighter,
  Icon,
  ImageIcon,
  Italic,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  Underline,
  Undo2Icon,
  UploadIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Level } from "@tiptap/extension-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}


const LineHeightButton = () => {
  const { editor } = useEditorStore();
  
  // 1. Explicitly track the active line height
  const [currentLineHeight, setCurrentLineHeight] = useState("normal");

  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2" }, // Renamed to Double for clarity
    { label: "2.5", value: "2.5" },
    { label: "3", value: "3" },
  ];

  // 2. Listen to Tiptap events to sync the active state
  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      // Find the current node we are interacting with
      const { selection } = editor.state;
      const { $from } = selection;
      const node = $from.node($from.depth);

      // Extract the line height from the node's attributes
      const activeLineHeight = node?.attrs?.lineHeight || "normal";
      setCurrentLineHeight(activeLineHeight);
    };

    updateState(); // Run on mount
    editor.on("transaction", updateState);
    editor.on("selectionUpdate", updateState);

    return () => {
      editor.off("transaction", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
              // Highlight the button if a non-default line height is active
              currentLineHeight !== "normal" && "bg-neutral-200/80"
            )}
          />
        }
      >
        <ListCollapseIcon className="size-4" />
      </DropdownMenuTrigger>
      
      {/* 3. Clean vertical layout for the line height options */}
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1 min-w-[120px]">
        {lineHeights.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            // Use your brilliant custom extension command!
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm cursor-pointer",
              // Apply active background highlight
              currentLineHeight === value && "bg-neutral-200/80"
            )}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  // 1. Explicitly track the value in the input box
  const [inputValue, setInputValue] = useState("16");
  const [isEditing, setIsEditing] = useState(false);

  // 2. Listen to Tiptap events to sync the displayed size with the cursor position
  useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      // Safely get the font size, strip the "px", and default to 16
      const currentSize = editor.getAttributes("textStyle").fontSize
        ? editor.getAttributes("textStyle").fontSize.replace("px", "")
        : "16";
        
      setInputValue(currentSize);
    };

    updateFontSize(); // Run on mount

    editor.on("transaction", updateFontSize);
    editor.on("selectionUpdate", updateFontSize);

    return () => {
      editor.off("transaction", updateFontSize);
      editor.off("selectionUpdate", updateFontSize);
    };
  }, [editor]);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      // Apply the size to Tiptap
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setInputValue(size.toString());
      setIsEditing(false);
    } else {
      // If the user types gibberish, reset it to the current Tiptap size
      const currentSize = editor?.getAttributes("textStyle").fontSize?.replace("px", "") || "16";
      setInputValue(currentSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(inputValue) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(inputValue) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onClick={decrement}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 cursor-pointer"
      >
        <MinusIcon className="size-4" />
      </button>

      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoFocus // Automatically focuses the input when clicked!
          className="h-7 w-10 text-sm text-center shrink-0 flex items-center justify-center rounded-sm border border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 px-1.5"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm px-1.5 hover:bg-neutral-200/80 cursor-pointer"
        >
          {inputValue}
        </button>
      )}

      <button
        onClick={increment}
        className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 cursor-pointer"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};


const ListButton = () => {
  const { editor } = useEditorStore();
  
  // 1. Track the currently active list type
  const [currentList, setCurrentList] = useState("none");

  const lists = [
    { 
      label: "Bullet List", 
      value: "bulletList", 
      icon: ListIcon, 
      onClick: () => editor?.chain().focus().toggleBulletList().run() 
    },
    { 
      label: "Ordered List", 
      value: "orderedList", 
      icon: ListOrderedIcon, 
      onClick: () => editor?.chain().focus().toggleOrderedList().run() 
    },
    { 
      label: "Task List", 
      value: "taskList", 
      icon: ListTodoIcon, 
      onClick: () => editor?.chain().focus().toggleTaskList().run() 
    },
  ];

  // 2. Listen to Tiptap events to update the active state
  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      // Check which list is currently active
      if (editor.isActive("bulletList")) setCurrentList("bulletList");
      else if (editor.isActive("orderedList")) setCurrentList("orderedList");
      else if (editor.isActive("taskList")) setCurrentList("taskList");
      else setCurrentList("none"); // Default/Inactive
    };

    updateState(); // Run on mount
    editor.on("transaction", updateState);
    editor.on("selectionUpdate", updateState);

    return () => {
      editor.off("transaction", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  // Find the currently active icon to display on the main toolbar
  // If no list is active, we default to the standard Bullet List icon
  const ActiveIcon = lists.find((l) => l.value === currentList)?.icon || ListIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
              // Highlight the main button if ANY list is active
              currentList !== "none" && "bg-neutral-200/80"
            )}
          />
        }
      >
        <ActiveIcon className="size-4" />
      </DropdownMenuTrigger>
      
      {/* 3. Horizontal layout mimicking Google Docs formatting tools */}
      <DropdownMenuContent className="w-full p-1 flex flex-row items-center gap-x-1 border-0 min-w-0">
        {lists.map(({ label, value, icon: Icon, onClick }) => (
          <DropdownMenuItem
            key={value}
            onClick={onClick}
            className={cn(
              "h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 cursor-pointer",
              // Apply active background highlight to the specific list type
              currentList === value && "bg-neutral-200/80"
            )}
            title={label}
          >
            <Icon className="size-4" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();
  
  // 1. Explicitly track the active alignment
  const [currentAlign, setCurrentAlign] = useState("left");

  const alignments = [
    { label: "Align Left", value: "left", icon: AlignLeftIcon },
    { label: "Align Center", value: "center", icon: AlignCenterIcon },
    { label: "Align Right", value: "right", icon: AlignRightIcon },
    { label: "Align Justify", value: "justify", icon: AlignJustifyIcon },
  ];

  // 2. Listen to Tiptap events to update the active state
  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      // Check which alignment is currently active
      if (editor.isActive({ textAlign: "center" })) setCurrentAlign("center");
      else if (editor.isActive({ textAlign: "right" })) setCurrentAlign("right");
      else if (editor.isActive({ textAlign: "justify" })) setCurrentAlign("justify");
      else setCurrentAlign("left"); // Default
    };

    updateState(); // Run on mount
    editor.on("transaction", updateState);
    editor.on("selectionUpdate", updateState);

    return () => {
      editor.off("transaction", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  // Find the currently active icon to display on the main toolbar
  const ActiveIcon = alignments.find((a) => a.value === currentAlign)?.icon || AlignLeftIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden"
            )}
          />
        }
      >
        <ActiveIcon className="size-4" />
      </DropdownMenuTrigger>
      
      {/* 3. Horizontal layout mimicking Google Docs */}
      <DropdownMenuContent className="w-full p-1 flex flex-row items-center gap-x-1 border-0 min-w-0">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
              // Apply active background highlight
              currentAlign === value && "bg-neutral-200/80"
            )}
            title={label}
          >
            <Icon className="size-4" />
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [imageUrl, setImageUrl] = useState("");

  // Helper to insert the image and clear the input
  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
    setImageUrl("");
  };

  // Handles native file explorer upload
  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Convert image to Base64 so it can be stored directly in the editor content
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onChange(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
    }
  };

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setImageUrl(""); // Clear the input when the menu closes
        }
      }}
    >
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
              // Highlights the button if an image is currently selected
              editor?.isActive("image") && "bg-neutral-200/80",
            )}
          />
        }
      >
        <ImageIcon className="size-4" />
      </DropdownMenuTrigger>

      {/* Increased width to fit the URL input nicely */}
      <DropdownMenuContent className="w-[300px] p-2 flex flex-col gap-y-2 border-0">
        {/* Option 1: File Upload */}
        <DropdownMenuItem onClick={onUpload} className="cursor-pointer">
          <UploadIcon className="size-4 mr-2" />
          Upload from computer
        </DropdownMenuItem>

        <Separator />

        {/* Option 2: Image URL */}
        <div className="flex items-center gap-x-2">
          <Input
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <Button onClick={handleImageUrlSubmit} size="sm">
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  // 1. Track the active state for the link button
  const [isLinkActive, setIsLinkActive] = useState(false);

  // 2. Listen to Tiptap events to highlight the button when on a link
  useEffect(() => {
    if (!editor) return;

    const updateState = () => {
      setIsLinkActive(editor.isActive("link"));
    };

    updateState(); // Run on mount
    editor.on("transaction", updateState);
    editor.on("selectionUpdate", updateState);

    return () => {
      editor.off("transaction", updateState);
      editor.off("selectionUpdate", updateState);
    };
  }, [editor]);

  const onChange = (href: string) => {
    // If the input is cleared, remove the link
    if (!href) {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setValue("");
  };

  return (
    <DropdownMenu
      // This is a much safer way to populate the input when the dropdown opens!
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setValue(editor?.getAttributes("link").href || "");
        }
      }}
    >
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
              // 3. Apply the active background class here!
              isLinkActive && "bg-neutral-200/80",
            )}
          />
        }
      >
        <Link2Icon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-full p-2.5 flex items-center gap-x-2 border-0">
        <Input
          placeholder="Paste link"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Un-commented and fixed your Enter key logic!
            if (e.key === "Enter") {
              onChange(value);
            }
          }}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  // Defaulting to white (#FFFFFF) for the background highlight fallback
  const [activeColor, setActiveColor] = useState("#FFFFFF");

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
    setActiveColor(color.hex);
  };

  // Listen to Tiptap events to update the color picker when the cursor moves
  useEffect(() => {
    if (!editor) return;

    const updateColor = () => {
      // Safely read the highlight color, and default back to white if no highlight is applied
      const currentColor = editor.getAttributes("highlight").color || "#FFFFFF";
      setActiveColor(currentColor);
    };

    // Run once on mount
    updateColor();

    // Listen for cursor movement and typing
    editor.on("transaction", updateColor);
    editor.on("selectionUpdate", updateColor);

    return () => {
      editor.off("transaction", updateColor);
      editor.off("selectionUpdate", updateColor);
    };
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
            )}
          />
        }
      >
        <Highlighter className="size-4" />
        <div
          className="h-1 w-full mt-0.5"
          style={{ backgroundColor: activeColor }}
        />
      </DropdownMenuTrigger>
      {/* Added border-0 and removed the padding so the picker takes full control */}
      <DropdownMenuContent className="w-full p-0 border-0">
        <SketchPicker color={activeColor} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();
  const [activeColor, setActiveColor] = useState("#000000");

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
    setActiveColor(color.hex);
  };

  // Listen to Tiptap events to update the color picker when the cursor moves
  useEffect(() => {
    if (!editor) return;

    const updateColor = () => {
      // Safely read the color, and default back to black if no color is applied
      const currentColor = editor.getAttributes("textStyle").color || "#000000";
      setActiveColor(currentColor);
    };

    // Run once on mount
    updateColor();

    // Listen for cursor movement and typing
    editor.on("transaction", updateColor);
    editor.on("selectionUpdate", updateColor);

    return () => {
      editor.off("transaction", updateColor);
      editor.off("selectionUpdate", updateColor);
    };
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden",
            )}
          />
        }
      >
        <span className="text-sm font-serif font-bold">A</span>
        <div
          className="h-1 w-full mt-0.5"
          style={{ backgroundColor: activeColor }}
        />
      </DropdownMenuTrigger>
      {/* Added border-0 and removed the padding so the picker takes full control */}
      <DropdownMenuContent className="w-full p-0 border-0">
        <SketchPicker color={activeColor} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "32px" },
    { label: "Heading 2", value: 2, fontSize: "24px" },
    { label: "Heading 3", value: 3, fontSize: "20px" },
    { label: "Heading 4", value: 4, fontSize: "18px" },
    { label: "Heading 5", value: 5, fontSize: "16px" },
    { label: "Heading 6", value: 6, fontSize: "14px" },
  ];

  // 1. Track the current active heading state explicitly
  const [currentHeading, setCurrentHeading] = useState(0);

  // 2. Listen for Tiptap updates to change the dropdown label
  useEffect(() => {
    if (!editor) return;

    const updateHeadingState = () => {
      for (let level = 1; level <= 6; level++) {
        if (editor.isActive("heading", { level })) {
          setCurrentHeading(level);
          return;
        }
      }
      setCurrentHeading(0); // If no heading is active, default to Normal text
    };

    updateHeadingState(); // Run immediately

    editor.on("transaction", updateHeadingState);
    editor.on("selectionUpdate", updateHeadingState);

    return () => {
      editor.off("transaction", updateHeadingState);
      editor.off("selectionUpdate", updateHeadingState);
    };
  }, [editor]);

  const getCurrentHeadingLabel = () => {
    if (currentHeading === 0) return "Normal text";
    return `Heading ${currentHeading}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 min-w-[120px] shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            )}
          />
        }
      >
        <span className="truncate">{getCurrentHeadingLabel()}</span>
        <ChevronDown className="ml-4 size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: value as Level })
                  .run();
              }
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80 cursor-pointer",
              // Use our explicit tracked state here for the gray background
              currentHeading === value && "bg-neutral-200/80",
            )}
          >
            {/* 3. Removed text-sm and moved the fontSize style directly to the span! */}
            <span style={{ fontSize, fontWeight: value > 0 ? 600 : 400 }}>
              {label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  // 1. Explicitly track font family
  const [currentFont, setCurrentFont] = useState("Arial");

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Verdana", value: "Verdana" },
    { label: "Times New Roman", value: "Times New Roman" },
  ];

  // 2. Keep the dropdown label in sync with cursor position
  useEffect(() => {
    if (!editor) return;

    const updateFontState = () => {
      // Safely get the current font or default to Arial
      const font = editor.getAttributes("textStyle").fontFamily || "Arial";
      setCurrentFont(font);
    };

    updateFontState();

    editor.on("transaction", updateFontState);
    editor.on("selectionUpdate", updateFontState);

    return () => {
      editor.off("transaction", updateFontState);
      editor.off("selectionUpdate", updateFontState);
    };
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            className={cn(
              "h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
            )}
          />
        }
      >
        <span className="truncate">{currentFont}</span>
        <ChevronDown className="ml-4 size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm cursor-pointer",
              // Use our synced state variable here
              currentFont === value && "bg-neutral-200/80",
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
        isActive && "bg-neutral-200/80",
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
            current === "false" ? "true" : "false",
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
      },
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
    ],
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
      <FontSizeButton/>
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {sections[1].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {/* text color  */}
      <TextColorButton />
      <HighlightColorButton />
      {/* highlight color */}
      <Separator
        orientation="vertical"
        className="h-6 bg-neutral-300 my-auto"
      />
      {/* link  */}
      <LinkButton />
      {/* image  */}
      <ImageButton />
      {/* align */}
      <AlignButton/>
      {/* line height */}
      <LineHeightButton/>
      <ListButton/>
      {/* list  */}
      {sections[2].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
    </div>
  );
};
