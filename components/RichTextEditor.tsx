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
        class: 'focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  /**
   * 🔴 CLAVE
   * TipTap NO es un input controlado.
   * Cuando cambia `value` (idioma / post), hay que sincronizar.
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

  const buttonBase =
    'px-2 py-1 rounded text-sm border border-transparent'
  const buttonActive =
    'bg-gray-900 text-white border-gray-900'
  const buttonInactive =
    'bg-white text-gray-700 hover:bg-gray-100'

  return (
    <div className="border rounded-xl overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonBase} ${
            editor.isActive('bold')
              ? buttonActive
              : buttonInactive
          } font-bold`}
        >
          B
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonBase} ${
            editor.isActive('italic')
              ? buttonActive
              : buttonInactive
          } italic`}
        >
          I
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${buttonBase} ${
            editor.isActive('underline')
              ? buttonActive
              : buttonInactive
          } underline`}
        >
          U
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`${buttonBase} ${
            editor.isActive('heading', { level: 2 })
              ? buttonActive
              : buttonInactive
          }`}
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`${buttonBase} ${
            editor.isActive('heading', { level: 3 })
              ? buttonActive
              : buttonInactive
          }`}
        >
          H3
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={`${buttonBase} ${
            editor.isActive('bulletList')
              ? buttonActive
              : buttonInactive
          }`}
        >
          • Lista
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={`${buttonBase} ${
            editor.isActive('orderedList')
              ? buttonActive
              : buttonInactive
          }`}
        >
          1. Lista
        </button>

        <button
          onClick={setLink}
          className={`${buttonBase} ${buttonInactive}`}
        >
          🔗 Link
        </button>

        <button
          onClick={addImage}
          className={`${buttonBase} ${buttonInactive}`}
        >
          🖼 Imagen
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${buttonBase} ${
            editor.can().undo()
              ? buttonInactive
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          ↶
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${buttonBase} ${
            editor.can().redo()
              ? buttonInactive
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
          prose
          max-w-none
          prose-p:my-3
          prose-headings:font-serif
          prose-h2:text-2xl
          prose-h3:text-xl
          prose-a:text-blue-600
          prose-a:underline
        "
      />
    </div>
  )
}

export default RichTextEditor
