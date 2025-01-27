import React from 'react';


interface CodeAreaProps {
    fileContent: string;
    setFileContent: React.Dispatch<React.SetStateAction<string>>;
}

const CodeArea: React.FC<CodeAreaProps> = ({ fileContent, setFileContent }) => {
    return (
        <div className="CodeArea">
            <textarea 
                value={fileContent} 
                onChange={(e) => setFileContent(e.target.value)} 
                rows={20} 
                className="editor-textarea" 
            />
        </div>
    );
}

export default CodeArea;