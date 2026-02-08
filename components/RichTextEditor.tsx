import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

interface Props {
  value: string
  onChange: (html: string) => void
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Escribe aquí el contenido del post…',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[260px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  /**
   * 🔴 CLAVE ABSOLUTA
   * TipTap NO es un input controlado.
   * Si cambia `value` (idioma / post), hay que forzar sync.
   */
  useEffect(() => {
    if (!editor) return

    const currentHTML = editor.getHTML()

    if (currentHTML !== value) {
      editor.commands.setContent(value || '', {
        emitUpdate: false,
      })
    }
  }, [value, editor])

  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('URL de la imagen')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL del enlace', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href: url }).run()
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2 text-sm">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold')
              ? 'font-bold bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic')
              ? 'italic bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive('underline')
              ? 'underline bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          U
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive('heading', { level: 2 })
              ? 'bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive('heading', { level: 3 })
              ? 'bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          H3
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive('bulletList')
              ? 'bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          • Lista
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive('orderedList')
              ? 'bg-gray-300 px-2 rounded'
              : 'px-2'
          }
        >
          1. Lista
        </button>

        <button onClick={setLink} className="px-2">
          🔗 Link
        </button>

        <button onClick={addImage} className="px-2">
          🖼 Imagen
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-2"
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-2"
        >
          ↷
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} className="p-4" />
    </div>
  )
}

export default RichTextEditor
