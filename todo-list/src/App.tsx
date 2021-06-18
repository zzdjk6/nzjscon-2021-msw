import React from "react";
import { TodoStatusFilter } from "./models/TodoStatusFilter";
import { useTodos } from "./hooks/useTodos";
import Container from "@material-ui/core/Container";
import TopBar from "./components/TopBar";
import StatusFilterTabs from "./components/StatusFilterTabs";
import { Alert, List } from "@material-ui/core";
import TodoItem from "./components/TodoItem";
import TodoInput from "./components/TodoInput";

const App: React.FC = () => {
  const [statusFilter, setStatusFilter] = React.useState(TodoStatusFilter.All);

  const { todos, addTodo, deleteTodo, toggleTodo, error, setError } = useTodos(statusFilter);

  return (
    <Container maxWidth="md" disableGutters={true}>
      <TopBar />

      <StatusFilterTabs
        statusFilter={statusFilter}
        onChange={(event, value) => {
          setStatusFilter(value);
        }}
      />

      {statusFilter !== TodoStatusFilter.Completed && <TodoInput addTodo={addTodo} />}

      {error && (
        <Alert severity={"error"} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <List>
        {todos.map((todo) => (
          <TodoItem todo={todo} key={todo.id} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />
        ))}
      </List>
    </Container>
  );
};

export default App;
