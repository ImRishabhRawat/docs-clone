import { Editor } from "./editor";
import { Toolbar } from "./toolbar";

interface Props{
  params: Promise<{documentId: string}>
}

const DocumentId = async ({params}: Props) => {
  const {documentId} = await params;
  return (
    <>
    <div className="min-h-screen bg-[#FAFBFD]">
      <Toolbar/>
    <Editor/>
      </div>
    </>
  )
}

export default DocumentId