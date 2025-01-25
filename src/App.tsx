import FileBar from "./components/FIleBar";
import FilePanel from "./components/FilesPanel";
import CodeArea from "./components/CodeArea";

const App: React.FC = () => {
    return(
        <div className="App">
            <FileBar/>
            <div className="workArea">
                <FilePanel/>
                <CodeArea/>
            </div>
        </div>
    )
}

export default App;