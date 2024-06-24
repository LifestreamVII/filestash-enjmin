import React from 'react';
import './sidebar.css';
import { Icon } from './icon';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="logo"></div>
        <p>Espace de stockage</p>
      </div>
      
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
      <ul>
        <li>
            <span>📁 My Folder</span>
            <ul className='tree'>
                <li>
                    <span>📁 My Folder 2</span>
                    <ul>
                        <li>
                            <span>📁 My Folder 4</span>
                        </li>
                        <li>
                            <span>📁 My Folder 5</span>
                        </li>
                    </ul>
                </li>
                <li>
                    <span>📁 My Folder 3</span>
                </li>
            </ul>
        </li>
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
