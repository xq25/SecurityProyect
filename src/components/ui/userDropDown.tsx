import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Divider, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setUser } from "../../store/userSlice";

import "../../styles/MaterialUI/MaterialDropDownUser.css";
import { useNavigate } from "react-router-dom";


export const AppDropdownUser: React.FC = () => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const Navegate = useNavigate()

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // limpia store y localStorage
    dispatch(setUser(null));
    localStorage.removeItem("user");
    localStorage.removeItem("session"); // si usas esta key para token
    handleClose();
    Navegate('/auth/signin');
    
  };

  // Evitar console.log repetidos; mostrar nombre o email por fallback
  const displayName = user?.name ?? user?.email ?? "Guest";
  const avatarSrc = (user as any)?.avatar || (user as any)?.photo || undefined;

  return (
    <Box className="material-dropdown-container">
      <IconButton
        className="material-dropdown-trigger"
        onClick={handleClick}
        size="large"
      >
        <Avatar
          alt={displayName}
          src={avatarSrc}
          className="material-dropdown-avatar"
        />
        <ArrowDropDownIcon className="material-dropdown-icon" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="material-dropdown-menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="material-dropdown-header">
          <Typography variant="subtitle1">{displayName}</Typography>
          <Typography variant="body2" color="textSecondary">
            Login User
          </Typography>
        </Box>
        <Divider />

        <MenuItem onClick={handleClose}>My Profile</MenuItem>
        <MenuItem onClick={handleClose}>My Contacts</MenuItem>
        <MenuItem onClick={handleClose}>Account Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} className="logout-item">
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
};
