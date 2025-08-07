import React, { useState, useRef, useMemo, useEffect } from 'react';
import JoditEditor from 'jodit-react';

const Example = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder || 'Start typings...',
    height: 1000 // Added to set the editor height
  }), [placeholder]);

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      tabIndex={1}
      onBlur={newContent => setContent(newContent)}
      onChange={newContent => setContent(newContent)}
    />
  );
};

export default Example;