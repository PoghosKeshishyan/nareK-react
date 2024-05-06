import { useEffect, useState, useRef } from 'react';
import { ContextMenu } from './ContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFileLines, faArrowLeft, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

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
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>
                )
            }

            {
                !files.files?.length && (
                    <div className='empty_folder'>
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
                                    <FontAwesomeIcon icon={faFolder} className='folder' />
                                ) : (
                                    <FontAwesomeIcon icon={faFileLines} className='file' />
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
                                    <p>{file.name}</p>
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

            <button className='btn' onClick={addFolderHandler}>
                <FontAwesomeIcon icon={faCirclePlus} />
                Add folder
            </button>

            {
                files.path && (
                    <label className='file-upload-container btn' htmlFor='file-upload'>
                        <FontAwesomeIcon icon={faCirclePlus} />
                        Add file
                        <input type='file' id='file-upload' onChange={addFileHandler} />
                    </label>
                )
            }
        </div>
    )
}
