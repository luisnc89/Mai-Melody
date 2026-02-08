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
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Escribe aquí el contenido del post…',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // 🔴 sincronizar cuando cambia idioma / post
  useEffect(() => {
    if (!editor) return

    if (editor.getHTML() !== value) {
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
    const url = window.prompt('URL del enlace', previousUrl || '')

    if (url === null) return

    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href: url }).run()
  }

  const btn =
    'px-2 py-1 rounded text-sm border transition'
  const active = 'bg-gray-900 text-white border-gray-900'
  const inactive =
    'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${
            editor.isActive('bold') ? active : inactive
          } font-bold`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} ${
            editor.isActive('italic') ? active : inactive
          } italic`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btn} ${
            editor.isActive('underline') ? active : inactive
          } underline`}
        >
          U
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${btn} ${
            editor.isActive('heading', { level: 2 })
              ? active
              : inactive
          }`}
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${btn} ${
            editor.isActive('heading', { level: 3 })
              ? active
              : inactive
          }`}
        >
          H3
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={`${btn} ${
            editor.isActive('bulletList')
              ? active
              : inactive
          }`}
        >
          • Lista
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={`${btn} ${
            editor.isActive('orderedList')
              ? active
              : inactive
          }`}
        >
          1. Lista
        </button>

        <button onClick={setLink} className={`${btn} ${inactive}`}>
          🔗 Link
        </button>

        <button onClick={addImage} className={`${btn} ${inactive}`}>
          🖼 Imagen
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btn} ${
            editor.can().undo()
              ? inactive
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btn} ${
            editor.can().redo()
              ? inactive
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          ↷
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="
          p-4
          min-h-[260px]
          focus:outline-none

          [&_p]:my-3

          [&_h2]:text-2xl
          [&_h2]:font-serif
          [&_h2]:font-bold
          [&_h2]:my-4

          [&_h3]:text-xl
          [&_h3]:font-serif
          [&_h3]:font-semibold
          [&_h3]:my-3

          [&_ul]:list-disc
          [&_ul]:pl-6
          [&_ul]:my-3

          [&_ol]:list-decimal
          [&_ol]:pl-6
          [&_ol]:my-3

          [&_li]:my-1

          [&_a]:text-blue-600
          [&_a]:underline
        "
      />
    </div>
  )
}

export default RichTextEditor
