// FileBar.tsx
import React, { useState } from 'react';
import { Menu, message, Dropdown, Modal, Input } from 'antd';
import { Button } from 'antd';

interface FileBarProps {
    fileName: string; // Nombre del archivo
    setFileName: React.Dispatch<React.SetStateAction<string>>;
    fileContent: string; // Contenido del archivo
    setFileContent: React.Dispatch<React.SetStateAction<string>>;
}

const FileBar: React.FC<FileBarProps> = ({ fileName, setFileName, fileContent, setFileContent }) => {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState<string>(fileName); // Estado para el nuevo nombre del archivo

    const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string); // Establecer el contenido del archivo
                setFileName(file.name); // Establecer el nombre del archivo
                message.info(`Archivo abierto: ${file.name}`); // Mensaje de confirmación
            };
            reader.readAsText(file); // Leer el archivo como texto
        }
    };

    const handleSave = () => {
        if (!fileName) {
            handleSaveAs()
        }else{
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
        // Mostrar un modal para que el usuario ingrese un nuevo nombre de archivo
        Modal.confirm({
            title: 'Guardar como',
            content: (
                <Input
                    defaultValue={fileName}
                    id='newNameField'
                    // onChange={(e) => setNewFileName(e.target.value)}  Esto lo hace mas lento, actualiza con cada letra
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

    const handleMenuClick = (key: string) => {
        setSelectedKey(key);
        if (key === 'open') {
            document.getElementById('fileInput')?.click();
        } else if (key === 'save') {
            handleSave();
        } else if (key === 'saveAs') {
            handleSaveAs();
        }
    };

    const menu = (
        <Menu selectedKeys={[]} onClick={({ key }) => handleMenuClick(key)}>
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
            <span style={{ fontSize: '30px', marginLeft: '20px', flex: 1, textAlign: 'center', color: "white" }}>
                {fileName || 'Sin nombre'}
            </span>
        </div>
    );
}

export default FileBar;