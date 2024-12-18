import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  IconButton,
  Typography,
  Divider,
  Tooltip,
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
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: isDrawerOpen ? 240 : 60, // Adjust width based on drawer state
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? 240 : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo and Hamburger Button */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: isDrawerOpen ? 'space-between' : 'center',
              alignItems: 'center',
            }}
          >
            {isDrawerOpen && (
              <img
                src={logo}
                alt="Logo"
                style={{ maxWidth: '80%', height: 'auto' }}
              />
            )}
            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Menu List */}
          <List>
            <Tooltip title="Home" placement="right" disableHoverListener={isDrawerOpen}>
              <ListItem
                button
                component={Link}
                to="/"
                selected={isActive('/')}
                sx={{
                  justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                  px: isDrawerOpen ? 2 : 0,
                }}
              >
                <ListItemIcon>
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
                  sx={{
                    justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                    pl: isDrawerOpen ? 4 : 0,
                  }}
                >
                  <ListItemIcon>
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
                  sx={{
                    justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                    pl: isDrawerOpen ? 4 : 0,
                  }}
                >
                  <ListItemIcon>
                    <AddBox />
                  </ListItemIcon>
                  {isDrawerOpen && <ListItemText primary="Create Project" />}
                </ListItem>
              </Tooltip>
            </CollapsibleSection>
          </List>

          {/* Footer with User Info */}
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Divider />
              {isDrawerOpen && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Avatar
                    alt={user.name}
                    src={`http://localhost:5000/uploads/${user.photoProfile}`}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Typography variant="h6">{user.name}</Typography>
                </Box>
              )}
              <IconButton onClick={handleLogout} sx={{ mt: 2 }}>
                <ExitToApp />
              </IconButton>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
