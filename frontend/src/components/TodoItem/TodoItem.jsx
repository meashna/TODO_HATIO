import React, { useState } from 'react';
import createApi from '../../services/api';
import styles from './TodoItem.module.css';
import Swal from 'sweetalert2';

function TodoItem({ todo, auth, refreshProject }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(todo.description);
  const [status, setStatus] = useState(todo.status);
  const api = createApi(auth.username, auth.password);

  const handleUpdate = async () => {
    if (!description) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Description cannot be empty!',
        confirmButtonText: 'Okay',
      });
      return;
    }
    try {
      await api.put(`/todos/${todo._id}`, { description, status });
      setIsEditing(false);
      refreshProject();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update the todo. Please try again later.',
        confirmButtonText: 'Close',
      });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the todo permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/todos/${todo._id}`);
          refreshProject();
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Todo deleted successfully.',
            confirmButtonText: 'Okay',
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the todo. Please try again later.',
            confirmButtonText: 'Close',
          });
        }
      }
    });
  };

  const toggleStatus = async () => {
    const newStatus = status === 'Pending' ? 'Completed' : 'Pending';
    try {
      await api.put(`/todos/${todo._id}`, { status: newStatus });
      setStatus(newStatus);
      refreshProject();
    } catch (err) {
      console.error('Failed to update status.', err);
    }
  };

  return (
    <li className={styles.todoItem}>
      {isEditing ? (
        <div className={styles.editingContainer}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
          />
          <button onClick={handleUpdate} className={`${styles.button} ${styles.editButton}`}>
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className={`${styles.button} ${styles.deleteButton}`}>
            Cancel
          </button>
        </div>
      ) : (
        <div className={styles.viewContainer}>
          <span
            className={`${styles.description} ${status === 'Completed' ? styles.completed : ''}`}
          >
            {todo.description}
          </span>
          <div className={styles.actions}>
            <input
              type="checkbox"
              checked={status === 'Completed'}
              onChange={toggleStatus}
              className={styles.checkbox}
            />
            <button onClick={() => setIsEditing(true)} className={`${styles.button} ${styles.editIcon}`}>
              ✏️
            </button>
            <button onClick={handleDelete} className={`${styles.button} ${styles.deleteIcon}`}>
              🗑️
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TodoItem;
