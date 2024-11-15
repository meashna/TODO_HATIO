// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login({ setAuth }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            // Attempt to login
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`),
                },
            });

            if (response.status === 200) {
                setAuth({ username, password });
                navigate('/', { state: { message: 'Login Successfully .Redirected to home page.......' } });
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred during login.');
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            {/* <h2 className={styles.heading}>Login</h2> */}
            
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                {location.state?.message && <p className={styles.success}>{location.state.message}</p>}
                <button type="submit" className={styles.button}>Login</button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.registerLink}>
                <p>
                    Don't have an account? <Link to="/register">Register here</Link>.
                </p>
            </div>
        </div>
    );
}

export default Login;