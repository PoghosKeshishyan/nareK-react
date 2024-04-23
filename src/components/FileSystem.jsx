import { useEffect, useState, useRef } from 'react';
import { ContextMenu } from './ContextMenu';
import { API_URL } from '../config';

export function FileSystem({
    files,
    images,
    handlerFile,
    activeFileId,
    keyDownActive,
    setOldFileName,
    addFileHandler,
    setActiveFileId,
    addFolderHandler,
    setKeyDownActive,
    onChangeFileName,
    previousFolderHandler,
    onSubmitChangeFileOrFolderName,
    deleteFolderOrFileHandler,
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
            deleteFolderOrFileHandler(file);
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
                        <img src={`${API_URL}${images['empty-folder']}`} alt='empty-folder' />
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
                                file.dir ? (
                                    <img src={`${API_URL}${images.folder}`} alt='folder' />
                                ) : (
                                    <img src={`${API_URL}${images.file}`} alt='folder' className='file' />
                                )
                            }

                            {
                                keyDownActive && activeFileId === file.id ? (
                                    <form onSubmit={(e) => onSubmitChangeFileOrFolderName(e, file)}>
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
                                        setContextMenuOpen={setContextMenuOpen}
                                        deleteFolderOrFileHandler={deleteFolderOrFileHandler}
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
