import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '..context/AuthContext';
import Button from '../../Components/Button';

function Login () {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
}

const{ login } = useAuth();
const navigate = useNavigate();

const submit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try{
        await login(username, password);

        navigate('/', { replace: true});
    } catch (err) {
        console.error('Login Error:, err');

        const status = err?.response?.status;

        if (status = 401 || status === 400) {
            setError('Invalid username or password.');
        } else if (!err.response) {
            setError('Network error. Please try again later.');
        } else {
            setError('An unexpected error occurred. Please try again later.');
        }
    } finally {
        setSubmitting(false);
    };




















    
}