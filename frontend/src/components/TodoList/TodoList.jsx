// src/components/TodoList.jsx
import React, { useState } from 'react';
import styles from './TodoList.module.css';
import TodoItem from '../TodoItem/TodoItem';
import createApi from '../../services/api';
import Swal from 'sweetalert2';

function TodoList({ project, auth, refreshProject }) {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const api = createApi(auth.username, auth.password);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!description) {
      setError('Description cannot be empty.');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Description cannot be empty!',
        confirmButtonText: 'Okay',
      });
      return;
    }
    try {
      await api.post(`/todos/${project._id}`, { description });
      setDescription('');
      setError('');
      refreshProject();
    } catch (err) {
      setError('Failed to add todo.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add the new todo. Please try again later.',
        confirmButtonText: 'Close',
      });
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {/* <h3 className={styles.heading}>Todos</h3> */}
      {/* {error && <p className={styles.error}>{error}</p>} */}
      <form onSubmit={handleAddTodo} className={styles.form}>
        <input
          type="text"
          placeholder="New Todo Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Add Todo
        </button>
      </form>
      {project.todos.length === 0 ? (
        <p className={styles.noTodos}>No todos found.</p>
      ) : (
        <ul className={styles.todoList}>
          {project.todos.map((todo) => (
            <TodoItem
              key={todo._id || todo.description + todo.createdDate}
              todo={todo}
              auth={auth}
              refreshProject={refreshProject}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;