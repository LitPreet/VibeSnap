const HighlightHashtags = ({ text }: { text: string }) => {
    const hashtagRegex = /#[\w]+/g; 

    const parts = text.split(/(#[\w]+)/g); 
  
    return (
      <p className="text-[15px] text-black">
        {parts.map((part, index) => (
          <span 
            key={index} 
            className={part.match(hashtagRegex) ? "text-blue-500" : undefined}
          >
            {part}
          </span>
        ))}
      </p>
    );
  };
  
  export default HighlightHashtags;