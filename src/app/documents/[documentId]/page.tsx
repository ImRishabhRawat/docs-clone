interface Props{
  params: Promise<{documentId: string}>
}

const DocumentId = async ({params}: Props) => {
  const {documentId} = await params;
  return (
    <div>DocumentId Page : {documentId}</div>
  )
}

export default DocumentId