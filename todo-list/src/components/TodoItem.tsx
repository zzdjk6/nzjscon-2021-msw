import React from "react";
import { Todo } from "../models/Todo";
import { Checkbox, IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
};

const TodoItem: React.FC<Props> = ({ todo, deleteTodo, toggleTodo }) => {
  return (
    <ListItem ContainerProps={{ "data-testid": "TodoItem" } as any}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          tabIndex={-1}
          checked={todo.completed}
          onClick={async (event) => {
            await toggleTodo(todo.id);
          }}
          aria-label={todo.description}
        />
      </ListItemIcon>
      <ListItemText
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.description}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={async (event) => {
            event.stopPropagation();
            await deleteTodo(todo.id);
          }}
          aria-label={"Delete"}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default TodoItem;
