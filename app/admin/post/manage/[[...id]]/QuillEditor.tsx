'use client';

import React, { useEffect, useRef, useState } from 'react';

interface QuillEditorProps {
  content: string;
  setContent: (content: string) => void;
  initialContent?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, setContent, initialContent }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && editorRef.current && !quillRef.current) {
      import('quill').then((module) => {
        import('quill/dist/quill.snow.css');
        const Quill = module.default;
        if (editorRef.current) {
          quillRef.current = new Quill(editorRef.current as HTMLElement, {
            theme: 'snow',
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                ['link', 'image'],
                ['clean'],
                ['code-block'],
              ],
            },
          });
          if (initialContent) {
            quillRef.current.root.innerHTML = initialContent;
          }
          quillRef.current.on('text-change', () => {
            setContent(quillRef.current.root.innerHTML);
          });
        }
      });
    }
  }, [isClient, initialContent, setContent]);
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  if (!isClient) {
    return <div className="border rounded min-h-[300px]" style={{ height: '300px' }} />;
  }

  return (
    <div className="border rounded min-h-[300px]">
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
};

export default QuillEditor;