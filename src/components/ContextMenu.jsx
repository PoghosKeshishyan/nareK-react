import { forwardRef } from 'react';
import axios from 'axios';

export const ContextMenu = forwardRef((props, ref) => {
  const handlerFile = async () => {
    props.setContextMenuOpen(false);
    await axios.post(`http://localhost:5000/files/open/folder`, { folderPath: props.files.path });
  }

  const handlerDelete = () => {
    if (props.file.dir) {
      props.deleteFolderHandler(props.file);
    } else {
      props.deleteFileHandler(props.file);
    }
  }

  const handlerRename = () => {
    props.setKeyDownActive(true);
    props.setActiveFileId(props.file.id);
    props.setContextMenuOpen(false);
  }

  return (
    <div ref={ref} className='ContextMenu'>
      <ul>
        <li onClick={handlerFile}>
          Open file location
        </li>

        <li onClick={handlerDelete}>
          Delete file
        </li>

        <li onClick={handlerRename}>
          Rename file name
        </li>
      </ul>
    </div>
  );
});
