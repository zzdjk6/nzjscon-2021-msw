import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";

const TopBar: React.FC = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1">
          Todo List
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
