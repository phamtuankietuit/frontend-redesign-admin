import React from 'react';

const MarkdownEnhanced = ({ children, className = '' }) => {
  const htmlString = children;

  return (
    <div className={`prose max-w-none px-6 pt-3 pb-5 ${className}`}>
      <div
        className="whitespace-pre-wrap text-justify"
        dangerouslySetInnerHTML={{ __html: htmlString }}
      />
    </div>
  );
};

export default MarkdownEnhanced;
