import React, { useState, useRef } from 'react';
import FileBar from "./components/FIleBar";
import FilePanel from "./components/FilesPanel";
import CodeArea from "./components/CodeArea";
import AnalizadorLexico from './compiler/AnalizadorLexico';

interface filelist {
    name: string,
    content: string
}

const App: React.FC = () => {
    const [files, setFiles] = useState<filelist[]>([]); 
    const [fileName, setFileName] = useState<string>(''); 
    const [fileContent, setFileContent] = useState<string>(''); 
    const analizadorRef = useRef<{ analyze: (text: string) => void }>(null);

    const openFile = (name: string, content: string): void => {
        setFiles([...files, { name: name, content: content }]);
    }

    const selectFile = (name: string) => {
        const select = files.find(item => item.name === name);
        if (select) {
            setFileName(select.name);
            setFileContent(select.content);
        }
    }

    const closeFile = (name: string) => {
        setFiles(files.filter(item => item.name !== name));
        if (fileName === name) {
            setFileName('');
            setFileContent('');
        }
    }

    const analyzeText = (text: string) => {
        if (analizadorRef.current) {
            analizadorRef.current.analyze(text);
        }
    }

    return (
        <div className="App">
            <FileBar 
                fileName={fileName} 
                setFileName={setFileName} 
                fileContent={fileContent} 
                setFileContent={setFileContent} 
                openFile={openFile}
                onFileContentChange={setFileContent}
                analyzeText={analyzeText} 
            />
            <div className ="workArea">
                <FilePanel
                    filesList={files}
                    updateOpened={selectFile}
                    closeFile={closeFile}
                />
                <CodeArea 
                    fileContent={fileContent} 
                    setFileContent={setFileContent} 
                />
                <AnalizadorLexico ref={analizadorRef} />
            </div>
        </div>
    );
}

export default App;