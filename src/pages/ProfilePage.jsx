import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSystem } from '../components/FileSystem';
import axios from 'axios';

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
    const responseHeader = await axios.get('http://localhost:3000/header');
    setHeader(responseHeader.data);

    const responseProvider = await axios.get('http://localhost:3000/provider');
    setProvider(responseProvider.data);

    const responseFiles = await axios.get('http://localhost:5000/files');
    setFiles(responseFiles.data);
  };

  const onChangeInput = (event) => {
    setShowSubmitBtn(true);
    setHeader({ ...header, title: event.target.value });
  };

  const onChangeLogo = (event) => {
    setShowSubmitBtn(true);
    setFile(event.target.files[0]);
    setHeader({ ...header, logo: `http://localhost:5000/uploads/${event.target.files[0].name}` })
  };

  const onChangeProviderInput = (event) => {
    setShowSubmitBtnProvider(true);
    setProvider({ ...provider, [event.target.name]: event.target.value });
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append('file', file);

    await axios.post('http://localhost:5000/upload', fd);
    await axios.put('http://localhost:3000/header', header);
    window.location.reload();
  };

  const onSubmitHandlerProvider = async (event) => {
    event.preventDefault();
    await axios.put('http://localhost:3000/provider', provider);
    setShowSubmitBtnProvider(false);
  }

  const handlerFile = async (file) => {
    if (!file.dir) {
      const sendingData = { path: files.path, filename: file.name };
      await axios.post(`http://localhost:5000/files/open`, sendingData);
    } else {
      const resopnse = await axios.get(`http://localhost:5000/files?path=${files.path}/${file.name}`);
      setFiles(resopnse.data);
    }
  }

  const previousFolderHandler = async (base) => {
    const newBase = base.split('/').slice(0, -1).join('/');
    const resopnse = await axios.get(`http://localhost:5000/files?path=${newBase}`);
    setFiles(resopnse.data);
  }

  const addFolderHandler = async () => {
    const sendingData = { path: files.path, foldername: `New folder (${files.files.length})` };
    await axios.post('http://localhost:5000/files/add/folder', sendingData);

    const newFolder = {
      id: Date.now(),
      dir: true,
      size: 0,
      name: `New folder (${files.files.length})`,
    }

    const result = [...files.files, newFolder];
    setFiles({ ...files, files: result });
  }

  const addFileHandler = async (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);

    await axios.post('http://localhost:5000/files/add/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { path: files.path },
    });

    const newFile = { id: Date.now(), dir: false, size: 0, name: event.target.files[0].name };
    const result = [...files.files, newFile];
    setFiles({ ...files, files: result });
  };

  const deleteFolderHandler = async (file) => {
    const confirm = window.confirm(`Are you sure you want to delete the ${file.name} folder?`);

    if (confirm) {
      const sendingData = { path: files.path, foldername: file.name };
      await axios.delete('http://localhost:5000/files/remove/folder', { data: sendingData });
      const newFiles = files.files.filter(elem => elem.id !== file.id);
      setFiles({ ...files, files: newFiles });
    }
  }

  const deleteFileHandler = async (file) => {
    const confirm = window.confirm(`Are you sure you want to delete the ${file.name} file?`);

    if (confirm) {
      const sendingData = { path: files.path, filename: file.name };
      await axios.delete('http://localhost:5000/files/remove/file', { data: sendingData });
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

  const onSubmitChangeFileName = async (event) => {
    event.preventDefault();
    const sendingData = { path: files.path, oldFileName, newName: newFileName };
    await axios.put('http://localhost:5000/files/edit', sendingData);
    setActiveFileId(-1);
    setKeyDownActive(false);
  }

  return (
    <div className='ProfilePage'>
      <Link to='/' className='btn home'>Home</Link>

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

                <span className='image-upload-label'>{header.logo.slice(29)}</span>
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
        deleteFileHandler={deleteFileHandler}
        onChangeFileName={onChangeFileName}
        deleteFolderHandler={deleteFolderHandler}
        previousFolderHandler={previousFolderHandler}
        onSubmitChangeFileName={onSubmitChangeFileName}
      />

      <Link className='btn' to='/history'>Payment history</Link>
    </div>
  );
}