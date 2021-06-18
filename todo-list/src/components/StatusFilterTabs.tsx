import React from "react";
import { Paper, Tab, Tabs } from "@material-ui/core";
import { TodoStatusFilter } from "../models/TodoStatusFilter";

type Props = {
  statusFilter: TodoStatusFilter;
  onChange?: (event: React.SyntheticEvent, value: TodoStatusFilter) => void;
};

const StatusFilterTabs: React.FC<Props> = ({ statusFilter, onChange }) => {
  return (
    <Paper square>
      <Tabs value={statusFilter} indicatorColor="primary" textColor="primary" variant="fullWidth" onChange={onChange}>
        <Tab label="All" value={TodoStatusFilter.All} />
        <Tab label="Active" value={TodoStatusFilter.Active} />
        <Tab label="Completed" value={TodoStatusFilter.Completed} />
      </Tabs>
    </Paper>
  );
};

export default StatusFilterTabs;
