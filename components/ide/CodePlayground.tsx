"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  type SandpackPredefinedTemplate,
} from "@codesandbox/sandpack-react";
import { atomDark, aquaBlue } from "@codesandbox/sandpack-themes";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import {
  Maximize2,
  Minimize2,
  TerminalSquare,
  FolderTree,
  Download,
  GripVertical,
  Play,
  RefreshCw,
  Sun,
  Moon,
  Copy,
  Check,
  Columns2,
  Rows2,
  ZoomIn,
  ZoomOut,
  Folder,
  FolderOpen,
  File,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Wand2,
  FileArchive,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useMemoryStore } from "@/store/memoryStore";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { PlaygroundStarterOption } from "@/data/playground-starters";

// Importing Prettier and JSZip for premium IDE features
import JSZip from "jszip";
import prettier from "prettier/standalone";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";

// ─── Types & Constants ────────────────────────────────────────────────────────
export interface CodePlaygroundProps {
  template?: SandpackPredefinedTemplate;
  files?: Record<string, string | { code: string; active?: boolean; hidden?: boolean }>;
  starterOptions?: PlaygroundStarterOption[];
  activeStarterId?: string;
  onStarterChange?: (id: string) => void;
  options?: {
    showConsole?: boolean;
    showFileExplorer?: boolean;
    readOnly?: boolean;
    editorHeight?: string | number;
  };
  customTheme?: "dark" | "light";
}

type LayoutMode = "horizontal" | "vertical" | "editor-only";

interface FileNode {
  name: string;
  path: string;
  isFolder: boolean;
  children?: FileNode[];
}

const PROTECTED_FILES = [
  "/package.json",
  "/App.js",
  "/index.js",
  "/src/App.js",
  "/src/index.js",
  "/styles.css",
  "/src/styles.css",
  "/index.html",
  "/public/index.html",
];

// Recursive helper to build nested directory tree from flat Sandpack files path keys
function buildFileTree(filePaths: string[]): FileNode {
  const root: FileNode = { name: "root", path: "", isFolder: true, children: [] };

  for (const path of filePaths) {
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const parts = cleanPath.split("/");
    let current = root;
    let accumulatedPath = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      accumulatedPath += "/" + part;
      const isLast = i === parts.length - 1;

      let child = current.children?.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: accumulatedPath,
          isFolder: !isLast,
          children: isLast ? undefined : [],
        };
        current.children?.push(child);
      }
      current = child;
    }
  }

  // Helper to sort folders first, then files alphabetically
  const sortTree = (node: FileNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.isFolder && !b.isFolder) return -1;
        if (!a.isFolder && b.isFolder) return 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortTree);
    }
  };
  sortTree(root);

  return root;
}

// ─── FileNodeComponent (Recursive Tree Renderer) ─────────────────────────────
function FileNodeItem({
  node,
  depth,
  expandedFolders,
  toggleFolder,
  activeFile,
  onFileSelect,
  isDark,
  onAddFile,
  onAddFolder,
  onDeleteFile,
  isCreating,
  setIsCreating,
  createType,
  newItemName,
  setNewItemName,
  onSubmitNewItem,
}: {
  node: FileNode;
  depth: number;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
  activeFile: string;
  onFileSelect: (path: string) => void;
  isDark: boolean;
  onAddFile: (parentPath: string) => void;
  onAddFolder: (parentPath: string) => void;
  onDeleteFile: (path: string) => void;
  isCreating: string | null;
  setIsCreating: (path: string | null) => void;
  createType: "file" | "folder" | null;
  newItemName: string;
  setNewItemName: (name: string) => void;
  onSubmitNewItem: () => void;
}) {
  const isExpanded = expandedFolders.has(node.path);
  const isActive = activeFile === node.path;
  const isProtected = PROTECTED_FILES.includes(node.path);

  if (node.path === "") {
    return (
      <div className="space-y-0.5">
        {node.children?.map((child) => (
          <FileNodeItem
            key={child.path}
            node={child}
            depth={0}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            isDark={isDark}
            onAddFile={onAddFile}
            onAddFolder={onAddFolder}
            onDeleteFile={onDeleteFile}
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            createType={createType}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            onSubmitNewItem={onSubmitNewItem}
          />
        ))}
      </div>
    );
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.isFolder) {
      toggleFolder(node.path);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        onClick={handleToggle}
        className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-xs cursor-pointer transition-all ${
          isActive
            ? "bg-brand-500/10 text-brand-500 font-bold border-l-2 border-brand-500 pl-[calc(var(--depth-padding)-2px)]"
            : isDark
            ? "text-white/80 hover:bg-white/5 hover:text-white"
            : "text-gray-700 hover:bg-surface-100 hover:text-gray-900"
        }`}
        style={{
          paddingLeft: isActive ? undefined : `${depth * 12 + 8}px`,
          // Define a fallback css variable for dynamic padding calculations
          // @ts-ignore
          "--depth-padding": `${depth * 12 + 8}px`,
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {node.isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 shrink-0 opacity-70" />
              ) : (
                <ChevronRight className="w-3 h-3 shrink-0 opacity-70" />
              )}
              {isExpanded ? (
                <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              )}
            </>
          ) : (
            <File className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-brand-500" : "text-gray-400"}`} />
          )}
          <span className="truncate">{node.name}</span>
        </div>

        {/* Hover Action Bar */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-2">
          {node.isFolder && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFile(node.path);
                }}
                title="New File"
                className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-brand-500 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFolder(node.path);
                }}
                title="New Folder"
                className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-brand-500 transition-colors"
              >
                <FolderPlus className="w-3 h-3" />
              </button>
            </>
          )}
          {!isProtected && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(node.path);
              }}
              title="Delete"
              className="p-0.5 rounded hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsed Directory Contents */}
      {node.isFolder && isExpanded && (
        <div className="mt-0.5">
          {/* Inline Editor for creating files/folders inside folders */}
          {isCreating === node.path && (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5"
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            >
              {createType === "folder" ? (
                <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              ) : (
                <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              )}
              <input
                autoFocus
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmitNewItem();
                  if (e.key === "Escape") setIsCreating(null);
                }}
                onBlur={onSubmitNewItem}
                className="bg-transparent text-xs w-full outline-none border-b border-brand-500 py-0.5 px-0.5 text-gray-800 dark:text-white"
                placeholder={createType === "folder" ? "folder-name" : "file.js"}
              />
            </div>
          )}

          {node.children?.map((child) => (
            <FileNodeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              isDark={isDark}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              onDeleteFile={onDeleteFile}
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              createType={createType}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
              onSubmitNewItem={onSubmitNewItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FileExplorerPanel (Directory tree, searching, file building) ─────────────
function FileExplorerPanel({ isDark }: { isDark: boolean }) {
  const { sandpack } = useSandpack();
  const { addToast } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["/src", "/public", "/components"])
  );

  // States for file/folder creation
  const [isCreating, setIsCreating] = useState<string | null>(null); // path of folder node, "" for root, null if inactive
  const [createType, setCreateType] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const visibleFiles = Object.keys(sandpack.files).filter(
    (path) => !sandpack.files[path].hidden
  );

  const toggleFolder = (path: string) => {
    const next = new Set(expandedFolders);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setExpandedFolders(next);
  };

  const handleAddFile = (parentPath: string) => {
    setIsCreating(parentPath);
    setCreateType("file");
    setNewItemName("");
    if (parentPath && !expandedFolders.has(parentPath)) {
      toggleFolder(parentPath);
    }
  };

  const handleAddFolder = (parentPath: string) => {
    setIsCreating(parentPath);
    setCreateType("folder");
    setNewItemName("");
    if (parentPath && !expandedFolders.has(parentPath)) {
      toggleFolder(parentPath);
    }
  };

  const handleDeleteFile = (filePath: string) => {
    if (PROTECTED_FILES.includes(filePath)) {
      addToast({
        type: "error",
        title: "Protected File",
        message: "This file cannot be deleted as it is vital to the template.",
      });
      return;
    }
    sandpack.deleteFile(filePath);
    addToast({
      type: "info",
      title: "File Deleted",
      message: `${filePath.split("/").pop()} was removed.`,
    });
  };

  const onSubmitNewItem = () => {
    if (!newItemName.trim() || isCreating === null) {
      setIsCreating(null);
      return;
    }

    const cleanName = newItemName.trim();
    const finalPath = isCreating === "" ? `/${cleanName}` : `${isCreating}/${cleanName}`;

    if (sandpack.files[finalPath]) {
      addToast({
        type: "error",
        title: "Already Exists",
        message: "A file or directory with that name already exists.",
      });
      return;
    }

    if (createType === "folder") {
      sandpack.addFile(`${finalPath}/.gitkeep`, "");
      if (!expandedFolders.has(finalPath)) {
        toggleFolder(finalPath);
      }
    } else {
      sandpack.addFile(finalPath, "");
      sandpack.openFile(finalPath);
      sandpack.setActiveFile(finalPath);
    }

    addToast({
      type: "success",
      title: "Item Created",
      message: `${cleanName} added.`,
    });

    setIsCreating(null);
  };

  const filteredFiles = visibleFiles.filter((filePath) =>
    filePath.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const fileTree = buildFileTree(filteredFiles);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col select-none">
      {/* File Explorer Title / Header */}
      <div
        className="flex-shrink-0 px-3 py-2 border-b flex items-center justify-between"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        }}
      >
        <span
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)" }}
        >
          Files
        </span>

        {/* Global Toolbar buttons for Root Folder creation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleAddFile("")}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors"
            title="Create File at Root"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleAddFolder("")}
            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-gray-400 hover:text-brand-500 transition-colors"
            title="Create Folder at Root"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="px-2 py-1.5 shrink-0 border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="relative flex items-center">
          <Search className="absolute left-2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[11px] bg-black/5 dark:bg-white/5 border border-transparent hover:border-black/10 dark:hover:border-white/10 focus:border-brand-500 focus:bg-white dark:focus:bg-transparent pl-7 pr-2 py-1 rounded-md outline-none text-gray-800 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Scrollable Directory list */}
      <div className="flex-1 min-h-0 overflow-auto p-2">
        {/* Inline editor at root level */}
        {isCreating === "" && (
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            {createType === "folder" ? (
              <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            ) : (
              <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            )}
            <input
              autoFocus
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmitNewItem();
                if (e.key === "Escape") setIsCreating(null);
              }}
              onBlur={onSubmitNewItem}
              className="bg-transparent text-xs w-full outline-none border-b border-brand-500 py-0.5 px-0.5 text-gray-800 dark:text-white"
              placeholder={createType === "folder" ? "folder-name" : "file.js"}
            />
          </div>
        )}

        <FileNodeItem
          node={fileTree}
          depth={0}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          activeFile={sandpack.activeFile}
          onFileSelect={(path) => {
            sandpack.openFile(path);
            sandpack.setActiveFile(path);
          }}
          isDark={isDark}
          onAddFile={handleAddFile}
          onAddFolder={handleAddFolder}
          onDeleteFile={handleDeleteFile}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          createType={createType}
          newItemName={newItemName}
          setNewItemName={setNewItemName}
          onSubmitNewItem={onSubmitNewItem}
        />
      </div>
    </div>
  );
}

// ─── Global Sandpack Editor CSS Fixes ─────────────────────────────────────────
const SANDPACK_GLOBAL_CSS = `
  .sp-wrapper, .sp-layout {
    height: 100% !important;
    min-height: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    background: transparent !important;
    display: flex !important;
    flex-direction: column !important;
  }
  /* Editor scroll */
  .sp-editor {
    height: 100% !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 !important;
  }
  .cm-editor {
    height: 100% !important;
    flex: 1 !important;
  }
  .cm-scroller {
    overflow: auto !important;
    min-height: 0 !important;
  }
  /* Preview iframe */
  .sp-preview, .sp-preview-container {
    flex: 1 !important;
    height: 100% !important;
    min-height: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    overflow: auto !important;
    -webkit-overflow-scrolling: touch !important;
    touch-action: pan-y !important;
  }
  .sp-preview-iframe {
    flex: 1 !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 0 !important;
    border: none !important;
    overflow: auto !important;
    -webkit-overflow-scrolling: touch !important;
  }
  /* Console */
  .sp-console {
    height: 100% !important;
    min-height: 0 !important;
    overflow: auto !important;
    background: transparent !important;
  }
  /* File explorer */
  .sp-file-explorer {
    width: 100% !important;
    min-width: 260px !important;
    display: block !important;
    height: 100% !important;
    overflow: auto !important;
    background: transparent !important;
  }
  .sp-file-explorer * {
    max-width: 100% !important;
  }
  /* Code tabs */
  .sp-tabs-scrollable-container {
    overflow-x: auto !important;
  }
`;

function InjectGlobalCSS({ fontSize }: { fontSize: number }) {
  return (
    <style>{`
      ${SANDPACK_GLOBAL_CSS}
      .sp-cm .cm-content, .sp-cm .cm-line { font-size: ${fontSize}px !important; }
      .sp-tab-button { font-size: 11px !important; }
    `}</style>
  );
}

// ─── IDEToolbar (toolbar menu inside SandpackProvider) ───────────────────────
function IDEToolbar({
  template,
  isDark,
  onToggleTheme,
  showExplorer,
  setShowExplorer,
  showConsole,
  setShowConsole,
  isFullscreen,
  onToggleFullscreen,
  layoutMode,
  setLayoutMode,
  fontSize,
  setFontSize,
  starterOptions,
  activeStarterId,
  onStarterChange,
  isCompact,
}: {
  template: string;
  isDark: boolean;
  onToggleTheme: () => void;
  showExplorer: boolean;
  setShowExplorer: (v: boolean) => void;
  showConsole: boolean;
  setShowConsole: (v: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  layoutMode: LayoutMode;
  setLayoutMode: (v: LayoutMode) => void;
  fontSize: number;
  setFontSize: (v: number) => void;
  starterOptions?: PlaygroundStarterOption[];
  activeStarterId?: string;
  onStarterChange?: (id: string) => void;
  isCompact?: boolean;
}) {
  const { sandpack } = useSandpack();
  const { addToast } = useUIStore();
  const [copied, setCopied] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const activeStarter = starterOptions?.find((s) => s.id === activeStarterId);

  const handleRun = () => {
    sandpack.runSandpack();
    addToast({ type: "success", title: "Reloading Preview…", message: "Refreshed browser environment." });
    useMemoryStore.getState().recordPlaygroundRun();
  };

  const handleCopy = async () => {
    const code = sandpack.files[sandpack.activeFile]?.code ?? "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: "success", title: "Copied!", message: "Code copied to clipboard." });
  };

  const handleFormat = async () => {
    const file = sandpack.activeFile;
    const code = sandpack.files[file]?.code ?? "";
    const ext = file.split(".").pop() || "";
    let parser = "";
    let plugins: any[] = [];

    if (["js", "jsx", "ts", "tsx"].includes(ext)) {
      parser = "babel";
      plugins = [babel, estree];
    } else if (["html", "htm"].includes(ext)) {
      parser = "html";
      plugins = [html];
    } else if (["css"].includes(ext)) {
      parser = "css";
      plugins = [postcss];
    } else if (["json"].includes(ext)) {
      parser = "json";
      plugins = [babel, estree];
    }

    if (!parser) {
      addToast({
        type: "info",
        title: "Cannot Format",
        message: `Prettier formatter does not support .${ext} files yet.`,
      });
      return;
    }

    try {
      setIsFormatting(true);
      const formatted = await prettier.format(code, {
        parser,
        plugins,
        singleQuote: false,
        trailingComma: "none",
      });
      sandpack.updateFile(file, formatted);
      addToast({
        type: "success",
        title: "Code Formatted",
        message: "Cleaned files with Prettier.",
      });
    } catch (err: any) {
      console.error(err);
      addToast({
        type: "error",
        title: "Format Error",
        message: err.message || "Could not format selected file.",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const files = sandpack.files;

      Object.keys(files).forEach((filePath) => {
        const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
        zip.file(cleanPath, files[filePath].code);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template}-playground-project.zip`;
      a.click();
      URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Project Downloaded! 📦",
        message: "Extracted whole sandbox folder to ZIP.",
      });
    } catch (err) {
      console.error("ZIP Generation Failed:", err);
      addToast({
        type: "error",
        title: "Export Failed",
        message: "Could not bundle project into ZIP.",
      });
    } finally {
      setIsZipping(false);
    }
  };

  const ICONS = { vanilla: "🟡", react: "⚛️", nextjs: "▲", static: "🌐" } as Record<string, string>;

  return (
    <div
      className="flex items-center justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b select-none gap-2"
      style={{
        background: isDark ? "#1a1b26" : "#f1f5fd",
        borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
      }}
    >
      {/* Title / macOS Dots */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
        {!isCompact && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] block" />
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#28c840] block cursor-pointer"
              onClick={onToggleFullscreen}
              title="Fullscreen"
            />
          </div>
        )}
        <span
          className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border truncate"
          style={{
            color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          {ICONS[template] ?? "📄"} {isCompact ? template.slice(0, 3) : template}
        </span>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-none">
        {starterOptions?.length ? (
          starterOptions.map((starter) => (
            <button
              key={starter.id}
              type="button"
              onClick={() => onStarterChange?.(starter.id)}
              title={starter.description}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 border ${
                starter.id === activeStarterId
                  ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                  : isDark
                  ? "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{starter.icon}</span>
              <span>{starter.label}</span>
            </button>
          ))
        ) : null}
      </div>

      {/* Primary Run Button */}
      <button
        type="button"
        onClick={handleRun}
        className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white text-[11px] font-bold transition-all shadow shadow-emerald-500/20 shrink-0"
      >
        <Play className="w-3 h-3 fill-white stroke-none" />
        {activeStarter ? activeStarter.label : "Run"}
      </button>

      {/* Command Actions */}
      <div className="flex items-center gap-0.5 shrink min-w-0">
        {/* Font adjustments */}
        {!isCompact && (
          <>
            <Btn onClick={() => setFontSize(Math.max(10, fontSize - 1))} title="Zoom Out" isDark={isDark}>
              <ZoomOut className="w-3.5 h-3.5" />
            </Btn>
            <span
              className="hidden sm:inline text-[9px] font-mono tabular-nums w-5 text-center"
              style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}
            >
              {fontSize}
            </span>
            <Btn onClick={() => setFontSize(Math.min(24, fontSize + 1))} title="Zoom In" isDark={isDark}>
              <ZoomIn className="w-3.5 h-3.5" />
            </Btn>
            <Sep isDark={isDark} />
          </>
        )}

        {/* Layout Modes */}
        {!isCompact && (
          <>
            <Btn
              onClick={() => setLayoutMode("horizontal")}
              title="Split Horizontal"
              active={layoutMode === "horizontal"}
              isDark={isDark}
            >
              <Columns2 className="w-3.5 h-3.5" />
            </Btn>
            <Btn
              onClick={() => setLayoutMode("vertical")}
              title="Split Vertical"
              active={layoutMode === "vertical"}
              isDark={isDark}
            >
              <Rows2 className="w-3.5 h-3.5" />
            </Btn>
            <Btn
              onClick={() => setLayoutMode("editor-only")}
              title="Maximize Editor"
              active={layoutMode === "editor-only"}
              isDark={isDark}
            >
              <span className="text-[10px] font-mono font-bold leading-none">&lt;/&gt;</span>
            </Btn>
            <Sep isDark={isDark} />
          </>
        )}

        {/* Utilities */}
        <Btn onClick={handleFormat} title="Prettier Formatter" isDark={isDark}>
          <Wand2 className={`w-3.5 h-3.5 ${isFormatting ? "animate-spin text-brand-500" : ""}`} />
        </Btn>
        <Btn onClick={handleCopy} title="Copy code" isDark={isDark}>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Btn>
        {!isCompact && (
          <Btn onClick={handleDownloadZip} title="Download Project Folder as ZIP" isDark={isDark}>
            <FileArchive className={`w-3.5 h-3.5 ${isZipping ? "animate-pulse" : ""}`} />
          </Btn>
        )}

        <Sep isDark={isDark} />

        {/* Panel Toggles */}
        <Btn
          onClick={() => setShowExplorer(!showExplorer)}
          title="Toggle File Explorer (Ctrl+Shift+E)"
          active={showExplorer}
          isDark={isDark}
        >
          <FolderTree className="w-3.5 h-3.5" />
        </Btn>
        <Btn
          onClick={() => setShowConsole(!showConsole)}
          title="Toggle Terminal Console (Ctrl+`)"
          active={showConsole}
          isDark={isDark}
        >
          <TerminalSquare className="w-3.5 h-3.5" />
        </Btn>
        <Btn onClick={onToggleTheme} title="Toggle editor theme" isDark={isDark}>
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Btn>
        <Btn onClick={onToggleFullscreen} title="Toggle Fullscreen (F11)" isDark={isDark}>
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </Btn>
      </div>
    </div>
  );
}

// ─── Small helper toolbar components ─────────────────────────────────────────
function Btn({
  children,
  onClick,
  title,
  active,
  isDark,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  active?: boolean;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        padding: "4px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active
          ? "#818cf8"
          : isDark
          ? "rgba(255,255,255,0.45)"
          : "rgba(0,0,0,0.45)",
        background: active
          ? isDark
            ? "rgba(129,140,248,0.12)"
            : "rgba(79,70,229,0.08)"
          : "transparent",
        transition: "all 0.12s",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = isDark
            ? "rgba(255,255,255,0.07)"
            : "rgba(0,0,0,0.06)";
          (e.currentTarget as HTMLButtonElement).style.color = isDark
            ? "rgba(255,255,255,0.9)"
            : "rgba(0,0,0,0.8)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = isDark
            ? "rgba(255,255,255,0.45)"
            : "rgba(0,0,0,0.45)";
        }
      }}
    >
      {children}
    </button>
  );
}

function Sep({ isDark }: { isDark: boolean }) {
  return (
    <div
      className="w-px h-4 mx-1"
      style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
    />
  );
}

// ─── Preview Bar Component ───────────────────────────────────────────────────
function PreviewBar({ isDark }: { isDark: boolean }) {
  const { sandpack } = useSandpack();
  return (
    <div
      className="flex items-center gap-2 px-2 py-1 shrink-0 border-b"
      style={{
        background: isDark ? "#13141f" : "#e8eeff",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}
    >
      <button
        type="button"
        onClick={() => sandpack.runSandpack()}
        className="p-1 rounded transition-colors"
        style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
        title="Refresh preview"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = isDark ? "#fff" : "#000")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color = isDark
            ? "rgba(255,255,255,0.4)"
            : "rgba(0,0,0,0.4)")
        }
      >
        <RefreshCw className="w-3 h-3" />
      </button>
      <div
        className="flex-1 text-[11px] font-mono px-2 py-0.5 rounded"
        style={{
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        }}
      >
        ⚡ sandbox preview
      </div>
    </div>
  );
}

// ─── Custom Resize Handle ─────────────────────────────────────────────────────
function ResizeHandle({ vertical = false }: { vertical?: boolean }) {
  return (
    <PanelResizeHandle
      style={{
        flexShrink: 0,
        ...(vertical
          ? { height: "4px", cursor: "row-resize" }
          : { width: "4px", cursor: "col-resize" }),
        background: "rgba(128,128,128,0.15)",
        transition: "background 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 10,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.5)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "rgba(128,128,128,0.15)")
      }
    >
      <GripVertical
        style={{
          width: 10,
          height: 10,
          color: "rgba(128,128,128,0.5)",
          transform: vertical ? "rotate(90deg)" : "none",
          pointerEvents: "none",
        }}
      />
    </PanelResizeHandle>
  );
}

function LoadingOverlay() {
  const { sandpack } = useSandpack();
  const loading = sandpack.status === "initial" || sandpack.status === "idle" || sandpack.status === "running";

  if (!loading) return null;

  return (
    <div className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-sm flex flex-col items-center justify-center z-30 transition-all duration-300">
      <div className="relative w-14 h-14 mb-4 flex items-center justify-center">
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-full bg-indigo-500/25 blur-xl animate-pulse" />
        {/* Dual outer spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
        {/* Inner reverse spinner */}
        <div className="absolute inset-2 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-[spin_1s_linear_infinite_reverse]" />
      </div>
      <p className="text-white font-black text-[10px] tracking-widest uppercase animate-pulse">Compiling Output...</p>
      <p className="text-slate-400 text-[9px] mt-1.5 font-medium">Booting up the live preview</p>
    </div>
  );
}

// ─── Main CodePlayground Component ────────────────────────────────────────────
export function CodePlayground({
  template = "vanilla",
  files,
  starterOptions,
  activeStarterId,
  onStarterChange,
  options = {},
  customTheme,
}: CodePlaygroundProps) {
  const [isDark, setIsDark] = useState(true);
  const [showConsole, setShowConsole] = useState(false);
  const [showExplorer, setShowExplorer] = useState(options.showFileExplorer ?? true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("horizontal");
  const [fontSize, setFontSize] = useState(14);
  const containerRef = useRef<HTMLDivElement>(null);
  const isCompact = useMediaQuery("(max-width: 640px)");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      const syncMobileLayout = () => {
        setLayoutMode("vertical");
        setShowExplorer(false);
      };

      syncMobileLayout();
    }
  }, [isMobile]);

  // Theme observer integration
  useEffect(() => {
    if (customTheme) {
      const applyTheme = () => setIsDark(customTheme === "dark");
      applyTheme();
      return;
    }

    const check = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, [customTheme]);

  // Fullscreen trigger setup
  const handleToggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  // Keyboard shortcut bounds
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setShowConsole((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "E") {
        e.preventDefault();
        setShowExplorer((v) => !v);
      }
      if (e.key === "F11") {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleToggleFullscreen]);

  const BG = isDark ? "#1a1b26" : "#f8faff";
  const EXPBG = isDark ? "#13141f" : "#eef1fc";
  const CONBG = isDark ? "#0d0e17" : "#e8ebf9";
  const BORDER = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: BG,
        borderRadius: isFullscreen ? 0 : 12,
        border: isFullscreen ? "none" : `1px solid ${BORDER}`,
        boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        ...(isFullscreen ? { position: "fixed", inset: 0, zIndex: 9999 } : {}),
      }}
    >
      <InjectGlobalCSS fontSize={fontSize} />

      <SandpackProvider
        template={template}
        files={files}
        theme={isDark ? atomDark : aquaBlue}
        options={{ initMode: "immediate", recompileMode: "immediate", recompileDelay: 300 }}
        style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
      >
        {/* Top toolbar header menu */}
        <IDEToolbar
          template={template}
          isDark={isDark}
          onToggleTheme={() => setIsDark((v) => !v)}
          showExplorer={showExplorer}
          setShowExplorer={setShowExplorer}
          showConsole={showConsole}
          setShowConsole={setShowConsole}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
          starterOptions={starterOptions}
          activeStarterId={activeStarterId}
          onStarterChange={onStarterChange}
          isCompact={isCompact}
        />

        {/* Content Resizable Pane Group */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex" }}>
          {/* ── HORIZONTAL Split-Pane layout ── */}
          {layoutMode === "horizontal" && (
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1, height: '100%', minWidth: 0, overflow: 'hidden' }}>
              {/* Fixed Width File Explorer */}
              {showExplorer && (
                <div
                  style={{
                    width: '240px',
                    flexShrink: 0,
                    background: EXPBG,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRight: `1px solid ${BORDER}`,
                  }}
                >
                  <FileExplorerPanel isDark={isDark} />
                </div>
              )}

              <PanelGroup key={`horizontal-${showConsole}`} orientation="horizontal" style={{ flex: 1, minHeight: 0 }}>


              {/* Central Editor */}
              <Panel
                defaultSize={showExplorer ? 37 : 55}
                minSize={25}
                style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers
                    showInlineErrors
                    closableTabs
                    readOnly={options.readOnly}
                    style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                  />
                </div>
              </Panel>

              <ResizeHandle />

              {/* Preview and Console Window pane */}
              <Panel
                defaultSize={showExplorer ? 35 : 45}
                minSize={20}
                style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                <PanelGroup key={`vertical-preview-${showConsole}`} orientation="vertical" style={{ flex: 1, minHeight: 0 }}>
                  {/* Web Output Preview */}
                  <Panel
                    defaultSize={showConsole ? 65 : 100}
                    minSize={25}
                    style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
                  >
                    <PreviewBar isDark={isDark} />
                    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "white", position: "relative" }}>
                      <SandpackPreview
                        showRefreshButton={false}
                        showNavigator={false}
                        showOpenInCodeSandbox={false}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <LoadingOverlay />
                    </div>
                  </Panel>

                  {/* Terminal Console */}
                  {showConsole && <ResizeHandle vertical />}
                  {showConsole && (
                    <Panel
                      defaultSize={35}
                      minSize={10}
                      maxSize={65}
                      style={{
                        background: CONBG,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "6px 12px",
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
                          borderBottom: `1px solid ${BORDER}`,
                          flexShrink: 0,
                        }}
                      >
                        <TerminalSquare style={{ width: 11, height: 11 }} />
                        Console Output
                        <span style={{ marginLeft: "auto", fontSize: 9, opacity: 0.5 }}>Ctrl+`</span>
                      </div>
                      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                        <SandpackConsole style={{ height: "100%" }} />
                      </div>
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>
            </PanelGroup>
            </div>
          )}

          {/* ── VERTICAL Split-Pane layout ── */}
          {layoutMode === "vertical" && (
            <PanelGroup key={`vertical-${showExplorer}-${showConsole}`} orientation="vertical" style={{ flex: 1, minHeight: 0 }}>
              {/* Upper row: Explorer and Editor */}
              <Panel defaultSize={50} minSize={20} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <PanelGroup key={`horizontal-top-${showExplorer}`} orientation="horizontal" style={{ flex: 1, minHeight: 0 }}>
                  {showExplorer && (
                    <Panel
                      defaultSize={22}
                      minSize={16}
                      maxSize={40}
                      style={{
                        background: EXPBG,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <FileExplorerPanel isDark={isDark} />
                    </Panel>
                  )}
                  {showExplorer && <ResizeHandle />}
                  <Panel defaultSize={showExplorer ? 78 : 100} minSize={40} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <SandpackCodeEditor
                      showTabs
                      showLineNumbers
                      showInlineErrors
                      closableTabs
                      readOnly={options.readOnly}
                      style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                    />
                  </Panel>
                </PanelGroup>
              </Panel>

              <ResizeHandle vertical />

              {/* Lower row: Live Web Output and Console logs */}
              <Panel defaultSize={50} minSize={20} style={{ display: "flex", overflow: "hidden" }}>
                <PanelGroup key={`horizontal-bottom-${showConsole}`} orientation="horizontal" style={{ flex: 1, minHeight: 0 }}>
                  <Panel defaultSize={showConsole ? 60 : 100} minSize={30} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <PreviewBar isDark={isDark} />
                    <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "white", position: "relative" }}>
                      <SandpackPreview
                        showRefreshButton={false}
                        showNavigator={false}
                        showOpenInCodeSandbox={false}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <LoadingOverlay />
                    </div>
                  </Panel>
                  {showConsole && <ResizeHandle />}
                  {showConsole && (
                    <Panel defaultSize={40} minSize={20} style={{ background: CONBG, overflow: "auto" }}>
                      <SandpackConsole style={{ height: "100%" }} />
                    </Panel>
                  )}
                </PanelGroup>
              </Panel>
            </PanelGroup>
          )}

          {/* ── EDITOR ONLY fullscreen view ── */}
          {layoutMode === "editor-only" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <SandpackCodeEditor
                showTabs
                showLineNumbers
                showInlineErrors
                closableTabs
                readOnly={options.readOnly}
                style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
              />
            </div>
          )}
        </div>

        {/* Professional Status Bar metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "3px 12px",
            fontSize: 10,
            flexShrink: 0,
            background: isDark ? "#0d0e17" : "#dde3f8",
            borderTop: `1px solid ${BORDER}`,
            color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="flex items-center gap-1.5">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 5px #22c55e",
                }}
              />
              Live
            </span>
            {!isCompact && <span>Font size: {fontSize}px</span>}
            {!isCompact && <span>View Layout: {layoutMode}</span>}
          </div>
          {!isCompact && (
            <div className="flex items-center gap-4">
              <span>Ctrl+` Toggle Output</span>
              <span>F11 Toggle Fullscreen</span>
              <span className="opacity-60">Engine: Sandpack v2</span>
            </div>
          )}
        </div>
      </SandpackProvider>
    </div>
  );
}
