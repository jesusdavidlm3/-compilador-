import FileBar from "./components/FIleBar";
import FilePanel from "./components/FilesPanel";
import CodeArea from "./components/CodeArea";
import React, { useState } from 'react';

const App: React.FC = () => {
    const [fileName, setFileName] = useState(''); 
    const [fileContent, setFileContent] = useState(''); 

    return (
        <div className="App">
            <FileBar 
                fileName={fileName} 
                setFileName={setFileName} 
                fileContent={fileContent} 
                setFileContent={setFileContent} 
            />
            <div className="workArea">
                <FilePanel />
                <CodeArea 
                    fileContent={fileContent} 
                    setFileContent={setFileContent} 
                />
            </div>
        </div>
    );
}

export default App;