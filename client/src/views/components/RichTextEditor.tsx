import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor || editor.getHTML() === value) {
      return
    }

    editor.commands.setContent(value || '<p></p>')
  }, [editor, value])

  if (!editor) {
    return (
      <div className="min-h-64 rounded-b-lg border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded px-2 py-1 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-800">
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded px-2 py-1 text-sm italic hover:bg-slate-200 dark:hover:bg-slate-800">
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-800">
          Heading
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-800">
          List
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="rounded px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-800">
          Undo
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="rounded px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-800">
          Redo
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-64 bg-white px-4 py-3 leading-7 outline-none dark:bg-slate-900"
      />
    </div>
  )
}

export default RichTextEditor
