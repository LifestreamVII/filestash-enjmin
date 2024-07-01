import React, { useEffect, useState } from 'react';
import './sidebar.css';
import { FileSystem, Files } from '../model/files';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const Folder = ({ name, children, onRefresh, path }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
      setIsOpen(!isOpen);
      onRefresh(path);
  };

  return (
      <li>
          <div className="folder-header">
              <span onClick={toggleOpen} className='action-button'>
              {isOpen ? "-" : "+"}
              </span>
            <Link to={"/files"+path}>📁 {name ? name : ""}</Link>
          </div>
          {isOpen && <ul className='tree'>
            { children.map((child, index) => (<Folder key={index} name={child.name} path={child.path} onRefresh={onRefresh} children={child.children ? child.children : []} />))
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
        // Filter directories from results
        const directories = res.results.filter((result) => result.type === "directory");
        // Update the state with new children for the matching folder
        if (p === '/') 
          {
            setFolders(directories);
            return;
          }
        console.log(directories);
        setFolders((currentFolders) => {
          const updateFolderChildren = (folders, path, children) => {
            return folders.map((folder) => {
              if (folder.path === path) {
                // Found the matching folder, update its children
                return { ...folder, children };
              } else if (folder.children && folder.children.length > 0) {
                // Recursively update children folders if any
                return { ...folder, children: updateFolderChildren(folder.children, path, children) };
              }
              return folder;
            });
        };
          return updateFolderChildren(currentFolders, p, directories);
        });
        setPath(p);
      }, (error) => setError(error));
      setObservers(observers => [...observers, observer]);
      setLoading(false);
      console.log(observers);
      console.log(observer);
  }

  useEffect(() => {
    onRefresh();
    const subscription = Files.updates.subscribe((res) => {
      console.log("refreshing..........................................;;")
      onRefresh(path);
    });
    setObservers(observers => [...observers, subscription]);
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
          <Link to={"/"}>Mes fichiers</Link>
        </div>
        <div className="menu-item">
          <i className="icon label-icon"></i>
          <Link to={"/tags"}>Tags</Link>
        </div>
        <div className="menu-item">
          <i className="icon trash-icon"></i>
          <Link to={"/trash"}>Corbeille</Link>
        </div>
        <div className="menu-item">
          <i className="icon contact-icon"></i>
          <Link to={"/contact"}>Contact</Link>
        </div>
      </div>

      <div className="submenu">
      <button onClick={()=>{onRefresh("/")}}>Refresh</button>
      <ul className='tree'>
        {folders.map((folder, index) => (
          <Folder key={index} onRefresh={onRefresh} name={folder.name} path={folder.path} children={folder.children ? folder.children : []} />
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
