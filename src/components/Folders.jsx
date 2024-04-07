import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Folders({
    folders,
    onChangeFileName,
    setKeyDownActive,
    addFolderHandler,
    deleteFolderHandler,
    keyDownActive,
    activeFolder,
    setActiveFolder,
    onSubmitChangeFolderName
}) {
    const [activeFolderId, setActiveFolderId] = useState(-1);
    const navigate = useNavigate();
    const folderRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        window.addEventListener('click', handlerWindow);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [activeFolderId])

    const handlerWindow = (event) => {
        try {
            if (!folderRef.current.contains(event.target)) {
                setKeyDownActive(false);
                setActiveFolder(false);
            }
        } catch { }
    }

    const handleFolderClick = (folderId) => {
        setActiveFolder(folderId);
    };

    const onKeyDownFolder = (event, id) => {
        if (event.key === 'F2') {
            setKeyDownActive(true);
            setActiveFolderId(id);
        }
    }

    return (
        <div className='Folders' ref={folderRef}>
            {
                folders.map(folder => (
                    <div
                        key={folder.id}
                        tabIndex={0}
                        onClick={() => handleFolderClick(folder.id)}
                        onDoubleClick={() => navigate(`/profile/folder/${folder.id}`)}
                        onKeyDown={e => onKeyDownFolder(e, folder.id)}
                        className={`folder ${activeFolder === folder.id ? 'active' : ''}`}
                    >
                        <p className="delete_file" onClick={() => deleteFolderHandler(folder.id)}>
                            &times;
                        </p>

                        <img src="folder.jpg" alt="folder" width={100} />

                        {
                            keyDownActive && activeFolderId === folder.id ? (
                                <form onSubmit={(e) => onSubmitChangeFolderName(e, folder.id)}>
                                    <input
                                        type="text"
                                        ref={inputRef}
                                        value={folder.title}
                                        onChange={(e => onChangeFileName(e, folder.id))}
                                    />
                                </form>
                            ) : (

                                <p onClick={() => navigate(`/profile/folder/${folder.id}`)}>
                                    {folder.title}
                                </p>
                            )
                        }
                    </div>
                ))
            }

            <button className="btn" onClick={addFolderHandler}>
                + Add folder
            </button>
        </div>
    )
}
