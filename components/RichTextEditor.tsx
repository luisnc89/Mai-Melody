import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Props {
  value: string
  onChange: (html: string) => void
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex gap-2 border-b bg-gray-50 p-2 text-sm">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[260px] prose max-w-none"
      />
    </div>
  )
}

export default RichTextEditor
