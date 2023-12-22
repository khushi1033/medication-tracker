import IconSync from './icons/IconSync.jsx';
import IconLogout from './icons/IconLogout.jsx';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

const Layout = ({
  children,
  showMenu = false,
  disconnectUser,
  refresh,
  isLoading,
  upgradeUser,
  downgradeUser,
  getUserPremiumStatus,
  prem,
}) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [IsPremium, setPremium] = useState(prem);

  


  const handleRefresh = (e) => {
    e.preventDefault();
    refresh();
  };

  const handleDisconnect = (e) => {
    e.preventDefault();
    setIsDisconnecting(true);
    setTimeout(() => {
      disconnectUser();
      setIsDisconnecting(false);
    }, 1500);
  };

  const handleUpgrade = (e) => {
    e.preventDefault();
    setPremium(true);
    upgradeUser();
  };

  const handleDowngrade = (e) => {
    e.preventDefault();
    setPremium(false)
    downgradeUser(); 
  };

  return (
    <div className="layout">
      <div className="title-menu">
        <h1>Medication Tracker</h1>
        {showMenu && (
          <div className="menu">
            <button
              onClick={handleRefresh}
              disabled={isLoading || isDisconnecting}
            >
              <div className={`menu-icon ${isLoading ? 'syncing' : ''}`}>
                <IconSync />
              </div>
              <span className="hidden-mobile">
                {isLoading ? 'Refreshing' : 'Refresh'}
              </span>
            </button>
            <div className="hidden-mobile">·</div>
            <button
              onClick={IsPremium ? handleDowngrade : handleUpgrade}
              disabled={isLoading || isDisconnecting}
            >
              <div className="menu-icon">
                {IsPremium ? 'Downgrade' : 'Upgrade'}
              </div>
            </button>
            <div className="hidden-mobile">·</div>
            <button
              onClick={handleDisconnect}
              disabled={isLoading || isDisconnecting}
            >
              <div className="menu-icon">
                <IconLogout />
              </div>
              <span className="hidden-mobile">
                {isDisconnecting ? 'Logging Out...' : 'Logout'}
              </span>
            </button>
          </div>
        )}
      </div>
      <main>{children}</main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  showMenu: PropTypes.bool.isRequired,
  disconnectUser: PropTypes.func,
  refresh: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  upgradeUser: PropTypes.func.isRequired,
  downgradeUser: PropTypes.func.isRequired,
};

export default Layout;

