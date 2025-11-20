// src/common/SidebarTemplate.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import "./SidebarTemplate.css";

const SidebarTemplate = ({
  isOpen,
  toggleSidebar,
  menuItems,
  submenuItems = [],
  profileData = {},
  isLoading = false,
  isMobile = false,
}) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Track active menu + submenu
  useEffect(() => {
    const index = menuItems.findIndex(
      (item) =>
        item.route === location.pathname ||
        (item.hasSubmenu &&
          submenuItems.some((sub) => sub.route === location.pathname))
    );

    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    const subItem = submenuItems.find((sub) => sub.route === location.pathname);
    if (subItem && activeSubItem !== subItem.label) {
      setActiveSubItem(subItem.label);
      if (index !== -1) {
        setOpenSubmenuIndex(index);
      }
    } else if (!subItem) {
      setActiveSubItem(null);
    }
  }, [location.pathname, menuItems, submenuItems, activeIndex, activeSubItem]);

  const handleMenuClick = useCallback(
    (index) => {
      const selectedItem = menuItems[index];

      if (index !== activeIndex) {
        setActiveIndex(index);
        setActiveSubItem(null);
      }

      if (selectedItem.hasSubmenu) {
        setOpenSubmenuIndex(openSubmenuIndex === index ? null : index);
      } else {
        setOpenSubmenuIndex(null);
        navigate(selectedItem.route);
        if (isMobile) {
          toggleSidebar();
        }
      }
    },
    [menuItems, activeIndex, navigate, openSubmenuIndex, isMobile, toggleSidebar]
  );

  const handleSubmenuClick = useCallback(
    (sub) => {
      if (activeSubItem !== sub.label) {
        setActiveSubItem(sub.label);
      }
      navigate(sub.route);
      if (isMobile) {
        toggleSidebar();
      }
    },
    [activeSubItem, navigate, isMobile, toggleSidebar]
  );

  // Profile initials
  const getProfileInitials = useCallback(() => {
    if (isLoading) return "⋯";
    if (profileData.name) return profileData.name[0]?.toUpperCase();
    return "U";
  }, [isLoading, profileData.name]);

  // Render profile details
  const renderProfileDetails = useCallback(() => {
    if (!isOpen) return null;

    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-1/2 mx-auto"></div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h2 className="font-semibold truncate text-sm md:text-base">
          {profileData.name || "User"}
        </h2>
        {profileData.extra && (
          <p className="text-xs text-gray-300 truncate">{profileData.extra}</p>
        )}
        {profileData.location && (
          <p className="text-xs text-gray-300 truncate">{profileData.location}</p>
        )}
      </div>
    );
  }, [isOpen, isLoading, profileData]);

  return (
    <div className={`sidebar-template ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Toggle Button */}
      <div className="sidebar-toggle-container">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? (
            <FiChevronLeft size={18} />
          ) : (
            <FiChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile-section">
        {profileData.profileImage ? (
          <img
            src={profileData.profileImage}
            alt="Profile"
            className={`sidebar-profile-image ${isOpen ? 'profile-image-large' : 'profile-image-small'}`}
          />
        ) : (
          <div className={`sidebar-profile-initials ${isOpen ? 'initials-large' : 'initials-small'}`}>
            {getProfileInitials()}
          </div>
        )}
        {renderProfileDetails()}
      </div>

      {isOpen && <hr className="sidebar-divider" />}

      {/* Menu */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-inner">
          <div className="sidebar-menu-items">
            {menuItems.map((item, index) => (
              <div key={index} className="sidebar-menu-item">
                <div
                  onClick={() => handleMenuClick(index)}
                  className={`sidebar-menu-link ${isOpen ? 'justify-start' : 'justify-center'} ${
                    activeIndex === index && !item.hasSubmenu
                      ? 'sidebar-menu-active'
                      : 'sidebar-menu-inactive'
                  }`}
                >
                  <span className="sidebar-menu-icon">{item.icon}</span>
                  {isOpen && (
                    <span className="sidebar-menu-label">{item.label}</span>
                  )}
                  {item.hasSubmenu && isOpen && (
                    <span className="sidebar-menu-arrow">
                      {openSubmenuIndex === index ? "▲" : "▼"}
                    </span>
                  )}
                </div>

                {item.hasSubmenu &&
                  isOpen &&
                  openSubmenuIndex === index && (
                    <div className="sidebar-submenu">
                      {submenuItems.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          onClick={() => handleSubmenuClick(sub)}
                          className={`sidebar-submenu-item ${
                            activeSubItem === sub.label
                              ? 'sidebar-submenu-active'
                              : 'sidebar-submenu-inactive'
                          }`}
                        >
                          <span className="sidebar-submenu-icon">
                            {sub.icon}
                          </span>
                          <span className="sidebar-submenu-label">
                            {sub.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default React.memo(SidebarTemplate);