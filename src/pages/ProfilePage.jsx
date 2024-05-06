import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSystem } from '../components/FileSystem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from '../axios';

export function ProfilePage() {
  const [provider, setProvider] = useState({ name: '', address: '', telephone: '', email: '' });
  const [files, setFiles] = useState({});
  const [header, setHeader] = useState({ title: '', logo: '' });
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);
  const [showSubmitBtnProvider, setShowSubmitBtnProvider] = useState(false);
  const [keyDownActive, setKeyDownActive] = useState(false);
  const [activeFileId, setActiveFileId] = useState(-1);
  const [oldFileName, setOldFileName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadingData();
  }, []);

  const loadingData = async () => {
    const responseHeader = await axios.get('header');
    setHeader(responseHeader.data[0]);

    const responseProvider = await axios.get('provider');
    setProvider(responseProvider.data[0]);

    const responseFiles = await axios.get('files');
    setFiles(responseFiles.data);
  };

  const onChangeInput = (event) => {
    setShowSubmitBtn(true);
    setHeader({ ...header, title: event.target.value });
  };

  const onChangeLogo = (event) => {
    setShowSubmitBtn(true);
    setFile(event.target.files[0]);
    setHeader({ ...header, logo: `images/${event.target.files[0].name}` })
  };

  const onChangeProviderInput = (event) => {
    setShowSubmitBtnProvider(true);
    setProvider({ ...provider, [event.target.name]: event.target.value });
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      await axios.post('files/add/file', fd);
    }

    await axios.put(`header/edit/${header.id}`, header);
    window.location.reload();
  };

  const onSubmitHandlerProvider = async (event) => {
    event.preventDefault();
    await axios.put(`provider/edit/${provider.id}`, provider);
    setShowSubmitBtnProvider(false);
  }

  /**
  ===============================================
  @Folders
  ===============================================
  **/

  const handlerFile = async (file) => {
    if (file.dir) {
      const resopnse = await axios.get(`files?path=${files.path}/${file.name}`);
      setFiles(resopnse.data);
    } else {
      const sendingData = { path: files.path, filename: file.name };
      await axios.post(`files/open/file`, sendingData);
    }
  }

  const previousFolderHandler = async (base) => {
    const newBase = base.split('/').slice(0, -1).join('/');
    const resopnse = await axios.get(`files?path=${newBase}`);
    setFiles(resopnse.data);
  }

  const addFolderHandler = async () => {
    const sendingData = { path: files.path, foldername: `New folder (${files.files.length + 1})` };
    await axios.post('files/add/folder', sendingData);

    /* Loading files data */
    const resopnse = await axios.get(`files?path=${files.path}`);
    setFiles(resopnse.data);
  }

  const addFileHandler = async (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    await axios.post('files/add/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { path: files.path },
    });

    const newFile = { id: Date.now(), dir: false, size: 0, name: event.target.files[0].name };
    const result = [...files.files, newFile];
    setFiles({ ...files, files: result });
  };

  const deleteFolderOrFileHandler = async (file) => {
    const confirm = window.confirm(`Are you sure you want to delete the ${file.name} ?`);

    if (confirm) {
      const sendingData = { path: files.path, foldername: file.name, dir: file.dir };
      await axios.delete('files/remove', { data: sendingData });
      const newFiles = files.files.filter(elem => elem.id !== file.id);
      setFiles({ ...files, files: newFiles });
    }
  }

  const onChangeFileName = (event, id) => {
    const newFiles = files.files.map(file => {
      if (file.id === id) {
        file.name = event.target.value;
      }

      return file;
    })

    const result = { ...files, files: newFiles };
    setFiles(result);
    setNewFileName(event.target.value);
  }

  const onSubmitChangeFileOrFolderName = async (event) => {
    event.preventDefault();
    const sendingData = { path: files.path, oldFileName, newName: newFileName };
    await axios.put('files/edit', sendingData);
    setActiveFileId(-1);
    setKeyDownActive(false);
  }

  return (
    <div className='ProfilePage'>
      <Link to='/' className='btn home'>
        <FontAwesomeIcon icon={faHouse} />
      </Link>

      <Link to={-1} className='btn back'>
        <FontAwesomeIcon icon={faCircleLeft} />
      </Link>

      <div className='edit_zone'>
        <div className='editProfile'>
          <form onSubmit={onSubmitHandler}>
            <div className='inputBox'>
              <p>Edit header title</p>
              <input type='text' value={header.title} name='title' onChange={onChangeInput} />
            </div>

            <div className='inputBox'>
              <p>Edit header logo</p>

              <label className='image-upload-container' htmlFor='image-upload'>
                <span className='image-upload-button'>Choose File</span>
                <input type='file' accept='image/*' id='image-upload' onChange={onChangeLogo} />
                <span className='image-upload-label'>{header.logo}</span>
              </label>
            </div>

            {showSubmitBtn && <input type='submit' value='Submit' className='btn' />}
          </form>
        </div>

        <div className='editProvider'>
          <p>Edit Provider's Contact</p>

          <form onSubmit={onSubmitHandlerProvider} className='providerForm'>
            <table>
              <tbody>
                <tr>
                  <td>Provider's name:</td>
                  <td>
                    <input
                      type='text'
                      name='name'
                      value={provider.name}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Address:</td>
                  <td>
                    <input
                      type='text'
                      name='address'
                      value={provider.address}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>Tel.</td>
                  <td>
                    <input
                      type='text'
                      name='telephone'
                      value={provider.telephone}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>

                <tr>
                  <td>E-mail:</td>
                  <td>
                    <input
                      type='text'
                      name='email'
                      value={provider.email}
                      onChange={onChangeProviderInput}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {
              showSubmitBtnProvider && <input type='submit' value='Update' className='btn' />
            }
          </form>
        </div>
      </div>

      <FileSystem
        files={files}
        handlerFile={handlerFile}
        activeFileId={activeFileId}
        keyDownActive={keyDownActive}
        setOldFileName={setOldFileName}
        addFileHandler={addFileHandler}
        setActiveFileId={setActiveFileId}
        setKeyDownActive={setKeyDownActive}
        addFolderHandler={addFolderHandler}
        onChangeFileName={onChangeFileName}
        previousFolderHandler={previousFolderHandler}
        onSubmitChangeFileOrFolderName={onSubmitChangeFileOrFolderName}
        deleteFolderOrFileHandler={deleteFolderOrFileHandler}
      />

      <Link className='btn' to='/story'>Payment history</Link>
    </div>
  );
}