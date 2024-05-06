import { forwardRef } from 'react';
import axios from '../axios';

export const ContextMenu = forwardRef((props, ref) => {
  const handlerFile = async () => {
    props.setContextMenuOpen(false);
    await axios.post(`files/open/folder`, { folderPath: props.files.path });
  }

  const handlerDelete = () => {
    props.deleteFolderOrFileHandler(props.file);
  }

  const handlerRename = () => {
    props.setActiveFileId(props.file.id);
    props.setKeyDownActive(true);
    setTimeout(() => props.setContextMenuOpen(false));
  }

  return (
    <div ref={ref} className='ContextMenu'>
      <ul>
        <li onClick={handlerFile}>
          Open location
        </li>

        <li onClick={handlerDelete}>
          Delete
        </li>

        <li onClick={handlerRename}>
          Rename
        </li>
      </ul>
    </div>
  );
});
