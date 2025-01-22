import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Home,
  Folder,
  ExitToApp,
  AccountTree,
  AddBox,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import logo from '../assets/logo.png';
import CollapsibleSection from './CollapsibleSection';
import { BASE_URL } from '../config';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <Drawer
        sx={{
          width: isDrawerOpen ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? 240 : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            backgroundColor: '#0D92F4', // Set drawer background color to blue
            color: 'white', // Set text color to white
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <div className="flex flex-col h-full">
          {/* Logo and Hamburger Button */}
          <div className={`p-2 flex ${isDrawerOpen ? 'justify-between' : 'justify-center'} items-center`}>
            {isDrawerOpen && (
              <img
                src={logo}
                alt="Logo"
                className="max-w-[80%] h-auto"
              />
            )}
            <IconButton onClick={toggleDrawer} className="text-white">
              <MenuIcon />
            </IconButton>
          </div>

          {/* Menu List */}
          <List>
            <Tooltip title="Home" placement="right" disableHoverListener={isDrawerOpen}>
              <ListItem
                button
                component={Link}
                to="/"
                selected={isActive('/')}
                className={`justify-${isDrawerOpen ? 'start' : 'center'} px-${isDrawerOpen ? 2 : 0}`}
              >
                <ListItemIcon className="text-white">
                  <Home />
                </ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Home" />}
              </ListItem>
            </Tooltip>

            <CollapsibleSection icon={<AccountTree />} text={isDrawerOpen ? 'Projects' : ''}>
              <Tooltip title="Project List" placement="right" disableHoverListener={isDrawerOpen}>
                <ListItem
                  button
                  component={Link}
                  to="/projects"
                  selected={isActive('/projects')}
                  className={`justify-${isDrawerOpen ? 'start' : 'center'} pl-${isDrawerOpen ? 4 : 0}`}
                >
                  <ListItemIcon className="text-white">
                    <Folder />
                  </ListItemIcon>
                  {isDrawerOpen && <ListItemText primary="Project List" />}
                </ListItem>
              </Tooltip>
              <Tooltip title="Create Project" placement="right" disableHoverListener={isDrawerOpen}>
                <ListItem
                  button
                  component={Link}
                  to="/create-project"
                  selected={isActive('/create-project')}
                  className={`justify-${isDrawerOpen ? 'start' : 'center'} pl-${isDrawerOpen ? 4 : 0}`}
                >
                  <ListItemIcon className="text-white">
                    <AddBox />
                  </ListItemIcon>
                  {isDrawerOpen && <ListItemText primary="Create Project" />}
                </ListItem>
              </Tooltip>
            </CollapsibleSection>
          </List>

          {/* Footer with User Info */}
          <div className="flex-grow" />
          {user && (
            <div className="p-2 text-center">
              <Divider className="bg-white" />
              {isDrawerOpen && (
                <div className="flex items-center mt-2">
                  <Avatar
                    alt={user.name}
                    src={`${BASE_URL}/uploads/${user.photoProfile}`}
                    className="w-15 h-15 mr-2"
                  />
                  <Typography variant="h6">{user.name}</Typography>
                </div>
              )}
              <IconButton onClick={handleLogout} className="mt-2 text-white">
                <ExitToApp />
              </IconButton>
            </div>
          )}
        </div>
      </Drawer>

      {/* Main Content */}
      <main className="flex-grow p-3">
        {children}
      </main>
    </div>
  );
};

export default Layout;