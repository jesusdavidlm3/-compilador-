import { CloseOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'

type file = {
    name: string,
    content: string
}

interface FilePanelProps{
    filesList: file[],
    updateOpened: (name: string) => void,
    closeFile: (name: string) => void
}

const FilePanel: React.FC<FilePanelProps> = ({filesList, updateOpened, closeFile}) => {
    return(
        <div className="FilePanel">
            {filesList.map((item: file) => (
                <div className="listItem" key={item.name} onClick={() => (updateOpened(item.name))}>
                    {item.name}
                    <Tooltip title="Cerrar">
                        <CloseOutlined className="closeIcon" onClick={(e) => {closeFile(item.name); e.stopPropagation()}}/>
                    </Tooltip>
                </div>
            ))}
        </div>
    )
}

export default FilePanel;