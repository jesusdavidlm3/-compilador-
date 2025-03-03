import React, { useState } from 'react';
import { Menu, message, Dropdown, Modal, Input, Button } from 'antd';

interface FileBarProps {
    fileName: string; 
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    fileContent: string; 
    setFileContent: React.Dispatch<React.SetStateAction<string>>;
    openFile: (name: string, content: string) => void;
    onFileContentChange: (content: string) => void; // Nueva prop
    analyzeText: (text: string) => void; // Nueva prop para análisis
}

const FileBar: React.FC<FileBarProps> = ({ fileName, setFileName, fileContent, setFileContent, openFile, onFileContentChange, analyzeText }) => {
    const [newFileName, setNewFileName] = useState <string>(fileName); 

    const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setFileContent(content);
                setFileName(file.name); 
                message.info(`Archivo abierto: ${file.name}`); 
                openFile(file.name, content);
                onFileContentChange(content); 
            };
            reader.readAsText(file); 
        }
    };

    const handleSave = () => {
        if (!fileName) {
            handleSaveAs();
        } else {
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; 
            a.click();
            URL.revokeObjectURL(url);
            message.info(`Archivo guardado: ${fileName}`); 
        }
    };

    const handleSaveAs = () => {
        Modal.confirm({
            title: 'Guardar como',
            content: (
                <Input
                    defaultValue={fileName}
                    id='newNameField'
                />
            ),
            onOk: () => {
                const newNameField = document.getElementById("newNameField").value;
                const blob = new Blob([fileContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = newNameField || 'archivo.txt'; 
                a.click();
                URL.revokeObjectURL(url);
                message.info(`Archivo guardado como: ${newNameField || 'archivo.txt'}`);
                setFileName(newNameField);
            },
        });
    };

    const handleCreateFile = () => {
        setFileContent('');
        setFileName('nuevo_archivo.txt'); 
        setNewFileName('nuevo_archivo.txt');
        message.info('Nuevo archivo creado.'); 
    };

    const handleCompile = () => {
        if (fileContent) {
            analyzeText(fileContent); 
            message.info('Compilando...', 1);
        } else {
            message.warning('No hay contenido para compilar.');
        }
    };

    const handleMenuClick = (key: string) => {
        if (key === 'open') {
            document.getElementById('fileInput')?.click();
        } else if (key === 'save') {
            handleSave();
        } else if (key === 'saveAs') {
            handleSaveAs();
        } else if (key === 'create') {
            handleCreateFile();
        }
    };

    const menu = (
        <Menu selectedKeys={[]} onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="create ">Crear archivo</Menu.Item>
            <Menu.Item key="open">
                <input type="file" onChange={handleOpen} style={{ display: 'none' }} id="fileInput" />
                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>Abrir</label>
            </Menu.Item>
            <Menu.Item key="save">Guardar</Menu.Item>
            <Menu.Item key="saveAs">Guardar como</Menu.Item>
        </Menu>
    );

    return (
        <div className="FileBar" style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button type="primary" style={{ marginRight: '20px', marginLeft:'30px' }}>Archivo</Button>
            </Dropdown>
            <Button
                    className="custom-primary"
                    type='primary'
                    onClick={handleCompile}
                    style={{ marginRight: '20px' }}
                        >
                    Compilar
            </Button>
            <span style={{ fontSize: '30px', marginLeft: '20px', flex: 1, textAlign: 'center', color: "white" }}>
                {fileName || 'Sin nombre'}
            </span>
        </div>
    );
}

export default FileBar;