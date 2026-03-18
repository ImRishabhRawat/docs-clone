import { Editor } from "./editor";

interface Props{
  params: Promise<{documentId: string}>
}

const DocumentId = async ({params}: Props) => {
  const {documentId} = await params;
  return (
    <>
    <div className="min-h-screen bg-[#FAFBFD]">
    <Editor/>
      </div>
    </>
  )
}

export default DocumentId