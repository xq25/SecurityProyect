import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Divider, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import "../../styles/MaterialUI/MaterialDropDownUser.css";

export const AppDropdownUser: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // 👤 Obtenemos el usuario del store global
//   const user = useSelector((state: RootState) => state.user.user);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="material-dropdown-container">
      <IconButton
        className="material-dropdown-trigger"
        onClick={handleClick}
        size="large"
      >
        <Avatar
        //   alt={user?.name || "User"}
          src={"/default-avatar.png"}
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
          <Typography variant="subtitle1">{"Guest"}</Typography>
          <Typography variant="body2" color="textSecondary">
            UX Designer
          </Typography>
        </Box>
        <Divider />

        <MenuItem onClick={handleClose}>My Profile</MenuItem>
        <MenuItem onClick={handleClose}>My Contacts</MenuItem>
        <MenuItem onClick={handleClose}>Account Settings</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} className="logout-item">
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
};
