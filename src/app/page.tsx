import Link from "next/link"

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      Click{" "}
      <Link href="/documents/234" className="text-blue-500 underline">
      <span>
        here
        </span>
      </Link>{" "}
      to go to documents
    </div>
  )
}

export default Home