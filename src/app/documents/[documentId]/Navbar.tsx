import Link from "next/link"

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/">
                <img src="/long-logo.svg" alt="Logo" className="h-8" />
                </Link>
                <div className="flex flex-col">
                    {}
                </div>
            </div>
        </nav>
    )
}