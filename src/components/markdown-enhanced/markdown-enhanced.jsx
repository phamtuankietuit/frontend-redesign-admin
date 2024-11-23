import React from 'react';

const processContent = (content) => {
  // Replace \n with <br/> in text content while preserving spaces
  if (typeof content === 'string') {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  }
  return content;
};

const MarkdownEnhanced = ({ children, className = '' }) => {
  const content = React.useMemo(() => String(children).trim(), [children]);

  return (
    <div className={`prose max-w-none px-6 pt-3 pb-5 ${className}`}>
      <div className="whitespace-pre-wrap text-justify">
        {processContent(content)}
      </div>
    </div>
  );
};

export default MarkdownEnhanced;
