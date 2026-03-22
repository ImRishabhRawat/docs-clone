import type { Metadata } from "next"
import Link from "next/link"
import { 
  Plus, 
  Search, 
  Settings, 
  FileText, 
  MoreVertical, 
  Menu,
  Clock,
  LayoutGrid,
  ChevronDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Docs Cloud | Dashboard",
  description: "Manage and create your documents in a powerful, modern editor.",
}

const Home = () => {
  const templates = [
    { title: "Blank", icon: <Plus className="size-10 text-blue-500" />, color: "bg-white" },
    { title: "Resume", icon: <FileText className="size-10 text-orange-500" />, color: "bg-orange-50" },
    { title: "Project Proposal", icon: <FileText className="size-10 text-green-500" />, color: "bg-green-50" },
    { title: "Meeting Notes", icon: <FileText className="size-10 text-blue-400" />, color: "bg-blue-50" },
  ]

  const recentDocs = [
    { id: "123", name: "Untitled Document", owner: "Me", lastModified: "Oct 24, 2023" },
    { id: "456", name: "Project Requirements", owner: "Me", lastModified: "Nov 02, 2023" },
    { id: "789", name: "Team Retrospective", owner: "Rishabh", lastModified: "Jan 12, 2024" },
    { id: "234", name: "Getting Started Guide", owner: "Docs Cloud", lastModified: "Mar 15, 2024" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FBFD] dark:bg-zinc-950 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white dark:bg-zinc-900 px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full md:hidden">
            <Menu className="size-6 text-zinc-600 dark:text-zinc-400" />
          </Button>
          <div className="flex items-center gap-1.5 cursor-pointer">
            <div className="bg-blue-600 p-1.5 rounded-sm">
              <FileText className="size-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-zinc-700 dark:text-zinc-200 tracking-tight">Docs</span>
          </div>
        </div>

        <div className="hidden flex-1 max-w-2xl mx-12 md:flex items-center bg-[#F1F3F4] dark:bg-zinc-800 rounded-lg px-4 py-1.5 ring-1 ring-zinc-200 dark:ring-zinc-700 focus-within:ring-2 focus-within:ring-blue-500/30 transition-shadow">
          <Search className="size-5 text-zinc-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search documents" 
            className="flex-1 bg-transparent border-none outline-none text-zinc-700 dark:text-zinc-200 placeholder-zinc-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Settings className="size-5 text-zinc-600 dark:text-zinc-400" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full p-0 h-10 w-10 overflow-hidden border border-zinc-200 dark:border-zinc-700">
                <Avatar className="h-full w-full">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">RR</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Hero/Templates Section */}
      <section className="bg-white dark:bg-zinc-900/50 py-8 px-4 md:px-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.30)]">
        <div className="max-w-[850px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-medium text-zinc-700 dark:text-zinc-300">Start a new document</h2>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-md transition-colors">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Template gallery</span>
              <ChevronDown className="size-4 text-zinc-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {templates.map((template, idx) => (
              <div key={idx} className="group cursor-pointer">
                <Link href={`/documents/${Math.random().toString(36).substr(2, 9)}`}>
                  <Card className={cn(
                    "relative aspect-3/4 overflow-hidden border border-zinc-200 dark:border-zinc-700 transition-all duration-300 ease-out hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 group-hover:-translate-y-1 shadow-sm",
                    template.color
                  )}>
                    <CardContent className="flex items-center justify-center p-0 h-full">
                      {template.icon}
                    </CardContent>
                  </Card>
                  <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 transition-colors truncate">
                    {template.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Documents Section */}
      <main className="flex-1 px-4 md:px-6 py-8 pb-24">
        <div className="max-w-[850px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">Recent documents</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Owned by anyone</span>
                <ChevronDown className="size-4 text-zinc-400" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-9 rounded-full">
                  <LayoutGrid className="size-5 text-zinc-600 dark:text-zinc-400" />
                </Button>
                <Button variant="ghost" size="icon" className="size-9 rounded-full">
                  <Clock className="size-5 text-zinc-600 dark:text-zinc-400" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {recentDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 transition-all duration-300"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors shadow-sm">
                  <FileText className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/documents/${doc.id}`} className="block">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <FileText className="size-3 text-blue-500 opacity-70" />
                       <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">Opened {doc.lastModified}</span>
                    </div>
                  </Link>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <span>{doc.owner}</span>
                </div>

                <div className="flex items-center ml-auto">
                   <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="size-4 text-zinc-500" />
                   </Button>
                </div>
              </div>
            ))}
          </div>

          {recentDocs.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-8 rounded-full mb-6">
                <FileText className="size-16 text-zinc-400 dark:text-zinc-600 shadow-inner" />
              </div>
              <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-2">No documents yet</h3>
              <p className="text-zinc-500 dark:text-zinc-500 max-w-[280px]">Create your first document using the templates above or start with a blank one.</p>
              <Button className="mt-6 rounded-full px-8 py-6 h-auto text-base font-semibold shadow-xl shadow-blue-500/20 hover:shadow-2xl transition-all" asChild>
                 <Link href={`/documents/${Math.random().toString(36).substr(2, 9)}`}>
                    <Plus className="size-5 mr-2" />
                    New Document
                 </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* FAB for Mobile */}
      <div className="md:hidden fixed right-6 bottom-6 flex flex-col gap-3 group">
        <Link href={`/documents/${Math.random().toString(36).substr(2, 9)}`}>
          <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all active:scale-95">
            <Plus className="size-7" />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home