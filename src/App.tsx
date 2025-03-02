import FileBar from "./components/FIleBar";
import FilePanel from "./components/FilesPanel";
import CodeArea from "./components/CodeArea";
import React, { useState } from 'react';

interface filelist{
    name: string,
    content: string
}

const App: React.FC = () => {
    const [files, setFiles] = useState<filelist[]>([]) 
    const [fileName, setFileName] = useState<string>(''); 
    const [fileContent, setFileContent] = useState<string>(''); 

    const openFile = (name: string, content: string): void => {
        setFiles([...files, {name: name, content: content}])
    }

    const selectFile = (name: string) => {
        const select = files.find(item => item.name == name)
        setFileName(select.name)
        setFileContent(select.content)
    }

    const closeFile = (name: string) => {
        setFiles(files.filter(item => item.name != name))
        if(fileName == name){
            setFileName('')
            setFileContent('')
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
            />
            <div className="workArea">
                <FilePanel
                    filesList={files}
                    updateOpened={selectFile}
                    closeFile={closeFile}
                />
                <CodeArea 
                    fileContent={fileContent} 
                    setFileContent={setFileContent} 
                />
            </div>
        </div>
    );
}

export default App;