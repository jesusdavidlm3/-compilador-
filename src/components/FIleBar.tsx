import React, { useState } from 'react';
import { Menu, message, Input } from 'antd';

const FileBar: React.FC = () => {
    const [fileName, setFileName] = useState(''); 
    const [fileContent, setFileContent] = useState(''); 

    const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
                setFileName(file.name);
                message.info(`Archivo abierto: ${file.name}`);
            };
            reader.readAsText(file);
        }
    };

    const handleSave = () => {
        if (!fileName) {
            message.error('No hay un archivo para guardar.');
            return;
        }
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        message.info(`Archivo guardado: ${fileName}`);
    };

    const handleSaveAs = () => {
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'archivo.txt'; 
        a.click();
        URL.revokeObjectURL(url);
        message.info(`Archivo guardado como: ${fileName || 'archivo.txt'}`);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    };

    return (
        <div>
            <Menu mode="horizontal" className="FileBar">
                <Menu.Item key="open">
                    <input type="file" onChange={handleOpen} style={{ display: 'none' }} id="fileInput" />
                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>Abrir</label>
                </Menu.Item>
                <Menu.Item key="save" onClick={handleSave}>Guardar</Menu.Item>
                <Menu.Item key="saveAs" onClick={handleSaveAs}>Guardar como</Menu.Item>
                <Menu.Item key="name">
                    <Input 
                        placeholder="Nombre del archivo" 
                        value={fileName} 
                        onChange={handleNameChange} 
                        style={{ width: 200 }} 
                    />
                </Menu.Item>
            </Menu>
            <textarea 
                value={fileContent} 
                onChange={(e) => setFileContent(e.target.value)} 
                rows={10} 
                style={{ width: '100%', marginTop: '20px' }} 
            />
        </div>
    );
}

export default FileBar;