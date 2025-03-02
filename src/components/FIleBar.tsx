import React, { useState } from 'react';
import { Menu, message, Dropdown, Modal, Input } from 'antd';
import { Button } from 'antd';

interface FileBarProps {
    fileName: string; 
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    fileContent: string; 
    setFileContent: React.Dispatch<React.SetStateAction<string>>;
    openFile: (name: string, content: string) => void
}

const FileBar: React.FC<FileBarProps> = ({ fileName, setFileName, fileContent, setFileContent, openFile }) => {
    const [ , setSelectedKey] = useState<string>(''); 
    const [newFileName, setNewFileName] = useState<string>(fileName); 

    const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
                setFileName(file.name); 
                message.info(`Archivo abierto: ${file.name}`); 
                openFile(file.name, e.target?.result as string)
            };
            reader.readAsText(file); 
        }
    };

    const handleSave = () => {
        if (!fileName) {
            handleSaveAs()
        } else {
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // Usar el nombre del archivo
            a.click();
            URL.revokeObjectURL(url);
            message.info(`Archivo guardado: ${fileName}`); // Mensaje de confirmación
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
                const newNameField = document.getElementById("newNameField").value
                const blob = new Blob([fileContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = newNameField || 'archivo.txt'; // Usar el nuevo nombre del archivo
                a.click();
                URL.revokeObjectURL(url);
                message.info(`Archivo guardado como: ${newNameField || 'archivo.txt'}`); // Mensaje de confirmación
                setFileName(newNameField)
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
        // Aquí puedes agregar la lógica para compilar el archivo
        // Por ejemplo, podrías enviar el contenido del archivo a un servidor o ejecutar un script
        message.info('Compilando...'); // Mensaje de confirmación     
    };

    const handleMenuClick = (key: string) => {
        setSelectedKey(key);
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
            <Menu.Item key="create">Crear archivo</Menu.Item>
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
            <Button color="purple" variant="solid" onClick={handleCompile} style={{ marginRight: '20px' }}>Compilar</Button>
            <span style={{ fontSize: '30px', marginLeft: '20px', flex: 1, textAlign: 'center', color: "white" }}>
                {fileName || 'Sin nombre'}
            </span>
        </div>
    );
}

export default FileBar;