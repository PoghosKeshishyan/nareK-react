import { useEffect, useState, useRef } from 'react';
import { ContextMenu } from './ContextMenu';

export function FileSystem({
    files,
    handlerFile,
    activeFileId,
    keyDownActive,
    setOldFileName,
    addFileHandler,
    setActiveFileId,
    addFolderHandler,
    setKeyDownActive,
    deleteFileHandler,
    onChangeFileName,
    deleteFolderHandler,
    previousFolderHandler,
    onSubmitChangeFileName
}) {
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuId, setContextMenuId] = useState(-1);
    const folderRef = useRef(null);
    const inputRef = useRef(null);
    const contextmenuRef = useRef(null);

    useEffect(() => {
        window.addEventListener('click', handlerWindow);
    }, [])

    const handlerWindow = (event) => {
        try {
            if (!folderRef.current.contains(event.target)) {
                setKeyDownActive(false);
                setActiveFileId(false);
            }

            if (!contextmenuRef.current.contains(event.target)) {
                setContextMenuOpen(false);
            }
        } catch { }
    }

    const onKeyDownFolder = (event, file) => {
        if (event.key === 'F2') {
            setKeyDownActive(true);
            setActiveFileId(file.id);
        }

        if (event.key === 'Delete') {
            if (file.dir) {
                deleteFolderHandler(file);
            } else {
                deleteFileHandler(file);
            }
        }
    }

    const handleContextMenu = (e, fileId) => {
        e.preventDefault();
        setContextMenuOpen(true);
        setContextMenuId(fileId);
        setActiveFileId(fileId);
    };

    return (
        <div className='FileSystem'>
            {
                files.path && (
                    <div className='previous' onClick={() => previousFolderHandler(files.path)}>
                        <i className='fa-solid fa-arrow-left'></i>
                    </div>
                )
            }

            {
                !files.files?.length && (
                    <div className='empty_folder'>
                        <img src='/empty-folder.png' alt='empty-folder' />
                        <p>Folder is empty</p>
                    </div>
                )
            }

            <div className='files-container' ref={folderRef}>
                {
                    files.files?.map((file, index) => (
                        <div
                            key={index}
                            tabIndex={0}
                            onClick={() => { setActiveFileId(file.id); setOldFileName(file.name) }}
                            onKeyDown={e => onKeyDownFolder(e, file)}
                            className={`file ${activeFileId === file.id ? 'active' : ''}`}
                            onDoubleClick={() => handlerFile(file)}
                            onContextMenu={(e) => handleContextMenu(e, file.id)}
                        >
                            {
                                file.dir ? (<img src='folder.jpg' alt='folder' />) : 
                                (<img src='file.png' alt='folder' className='file' />)
                            }

                            {
                                keyDownActive && activeFileId === file.id ? (
                                    <form onSubmit={(e) => onSubmitChangeFileName(e, file)}>
                                        <input
                                            type='text'
                                            ref={inputRef}
                                            value={file.name}
                                            onChange={(e => onChangeFileName(e, file.id))}
                                        />
                                    </form>
                                ) : (
                                    <>
                                        {
                                            file.name.length > 15
                                                ?
                                                <p>{file.name.slice(0, 15)}...</p>
                                                :
                                                <p>{file.name}</p>
                                        }
                                    </>
                                )
                            }

                            {
                                contextMenuOpen && contextMenuId === file.id && (
                                    <ContextMenu
                                        files={files}
                                        file={file}
                                        ref={contextmenuRef}
                                        setActiveFileId={setActiveFileId}
                                        setKeyDownActive={setKeyDownActive}
                                        deleteFileHandler={deleteFileHandler}
                                        setContextMenuOpen={setContextMenuOpen}
                                        deleteFolderHandler={deleteFolderHandler}
                                    />
                                )
                            }
                        </div>
                    ))
                }
            </div>

            <button className='btn' onClick={addFolderHandler}>+ Add folder</button>

            {
                files.path && (
                    <label className='file-upload-container' htmlFor='file-upload'>
                        <span className='btn'>+ Add file</span>
                        <input type='file' accept='*/*' id='file-upload' onChange={addFileHandler} />
                    </label>
                )
            }
        </div>
    )
}
