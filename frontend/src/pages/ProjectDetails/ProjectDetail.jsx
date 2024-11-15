// src/pages/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import createApi from '../../services/api';
import TodoList from '../../components/TodoList/TodoList';
import styles from './ProjectDetails.module.css';
import Swal from 'sweetalert2';

function ProjectDetail({ auth }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const api = createApi(auth.username, auth.password);

    const [project, setProject] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [gistUrl, setGistUrl] = useState('');

    useEffect(() => {
        fetchProject();
        // eslint-disable-next-line
    }, []);

    const fetchProject = async () => {
        try {
            const response = await api.get(`/projects/${id}`);
            setProject(response.data);
            setTitle(response.data.title);
        } catch (err) {
            setError('Failed to fetch project.');
            console.error(err);
        }
    };

    const handleUpdateTitle = async () => {
        if (!title) {
            setError('Title cannot be empty.');
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Title cannot be empty!',
                confirmButtonText: 'Okay',
            });
            return;
        }
        if (title === project.title) {
            Swal.fire({
                icon: 'info',
                title: 'No Changes Detected',
                text: 'You need to make changes to the title before updating.',
                confirmButtonText: 'Got it!',
            });
            return;
        }
        try {
            const response = await api.put(`/projects/${id}`, { title });
            console.log('Updated Project:', response.data);
            Swal.fire({
                icon: 'success',
                title: 'Title Updated',
                text: 'Project title has been successfully updated.',
                confirmButtonText: 'Great!',
            });
            setProject(response.data);
            setError('');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update the project title. Please try again later.',
                confirmButtonText: 'Close',
            });
            console.error(err);
        }
    };

    // const handleDeleteProject = async () => {
    //     if (window.confirm('Are you sure you want to delete this project?')) {
    //         try {
    //             await api.delete(`/projects/${id}`);
    //             navigate('/');
    //         } catch (err) {
    //             setError('Failed to delete project.');
    //             console.error(err);
    //         }
    //     }
    // };
    const handleDeleteProject = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won’t be able to recover this project!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/projects/${id}`);
                    Swal.fire('Deleted!', 'Your project has been deleted.', 'success');
                    navigate('/');
                } catch (err) {
                    setError('Failed to delete project.');
                    console.error(err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to delete the project. Please try again later.',
                        confirmButtonText: 'Close',
                    });
                }
            }
        });
    };

    const handleExportGist = async () => {
        try {
            const response = await api.post(`/projects/${id}/export`);
            setGistUrl(response.data.gistUrl);
            Swal.fire({
                icon: 'success',
                title: 'Gist Exported',
                text: 'Project exported successfully as a Gist.',
                confirmButtonText: 'View Gist',
            });
            setError('');
        } catch (err) {
            setError('Failed to export gist.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to export the project as a Gist.',
                confirmButtonText: 'Close',
            });
            console.error(err);
        }
    };

    if (!project) return <p className={styles.loading}>Loading...</p>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Project Details</h2>
            {/* {error && <p className={styles.error}>{error}</p>} */}
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.input}
                />
                <button onClick={handleUpdateTitle} className={styles.button}>
                    Update Title
                </button>
                <button
                    onClick={handleDeleteProject}
                    className={`${styles.button} ${styles.deleteButton}`}
                >
                    Delete Project
                </button>
                <button onClick={handleExportGist} className={styles.button}>
                Export as Gist
            </button>
            </div>

            {gistUrl && (
                <p className={styles.gistUrl}>
                    Gist Created:{' '}
                    <a href={gistUrl} target="_blank" rel="noopener noreferrer">
                        {gistUrl}
                    </a>
                </p>
            )}
            <TodoList project={project} auth={auth} refreshProject={fetchProject} />
        </div>
    );
}

export default ProjectDetail;
