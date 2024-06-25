import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { FileSystem } from '../model/files';

const Folder = ({ name, children, onRefresh, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
      setIsOpen(!isOpen);
      onRefresh(path);
  };

  return (
      <li>
          <div className="folder-header" onClick={toggleOpen}>
              {isOpen ? "-" : "+"}
            <span>📁 {name}</span>
          </div>
          {isOpen && <ul className='tree'>
            { children.map((child, index) => (<Folder key={index} name={child.name} path={child.path} onRefresh={onRefresh} children={[]} />))
            }
          </ul>
          }
      </li>
  );
};

const Sidebar = () => {
  
  // const sample_folders = [
  //   {name: "Root", path: "/",
  //     children: [{name: "My Folder 2", path: "/folder1",
  //       children: [{name: "My Folder 4"}, {name: "My Folder 5", children: [{name: "My Folder 9"}]}]
  //     }, 
  //     {name: "My Folder 3"}
  //   ]},
  //   {name: "My Folder 6", 
  //     children: [{name: "My Folder 7"}, {name: "My Folder 8"}]
  //   },
  // ];


  const sample_folders = [
    {name: "/", path: "/",
      children: []}
  ];

  const [folders, setFolders] = useState(sample_folders);

  const [path, setPath] = useState('/');

  const [observers, setObservers] = useState([]);
  
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const files = new FileSystem();

  const cleanupListeners = () => {
    if (observers.length > 0) {
        setObservers(observers.filter((observer) => {
            observer.unsubscribe();
            return false;
        }));
    }
  }

  const onRefresh = (p=path) => {
    console.log(p);
    setLoading(true);
    cleanupListeners();
    const observer = files.ls(p, false).subscribe((res) => {
        if (res.status !== "ok") {
            return;
        }
        setFolders(res.results.filter((result) => result.type === "directory"));
        setPath(p);
      }, (error) => setError(error));
      setObservers(observers => [...observers, observer]);
      setLoading(false);
      console.log(observers);
      console.log(observer);
  }

  useEffect(() => {
    onRefresh("/");
  }, []);

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo"></div>
        <p>Espace de stockage</p>
      </div>
      { error ? <div className="error">{error}</div> : null }
      { loading ? <div className="loading">{"Loading"}</div> : null }
      <div className="menu">
        <div className="menu-item active">
          <i className="icon home-icon"></i>
          <span>Accueil</span>
        </div>
        <div className="menu-item">
          <i className="icon label-icon"></i>
          <span>Labels</span>
        </div>
        <div className="menu-item">
          <i className="icon trash-icon"></i>
          <span>Corbeille</span>
        </div>
      </div>

      <div className="submenu">
      <button onClick={()=>{onRefresh(path)}}>Refresh</button>
      <ul>
        {folders.map((folder, index) => (
          <Folder key={index} onRefresh={onRefresh} name={folder.name} path={folder.path} children={[]} />
        ))}
      </ul>
      </div>

      <div className="storage-section">
        <h4>Storage</h4>
        <div className="storage-bar"></div>
      </div>
      <div className="logout">
        Log Out
      </div>
    </div>
  );
};

export { Sidebar };
