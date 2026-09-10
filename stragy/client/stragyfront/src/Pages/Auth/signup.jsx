import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/auth';
import Button from '../../components/Button';

function Signup() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
});

const [error,s setError] = useState('');
const [submitting, setSubmitting] = useState(false);

const { signup } = useAuth();
const navigate = useNavigate(;

const handleCHange = (event) => {
    const { name, value} = event.target;

    if (error) setError (null);
    
    setForm(previous) => ({
        ...previous,
        [name]: value, 
}));
};

const submit = async (event) => {
    event.preventDefult();
    if (submitting) return;

    setError(null); 

    if (form.password !== form.comfirmPassword) {
        setError('Passwords do not match'); 
        return;
    }
 
    if (form.password.length < 5) {
        setError('Password must be at least 5 characters long');
        return;
    }

    setSubmitting(true);

    try {
        const signupData = {
            username : form.username.trim(),
            email: form.email.trim(),
            password: form.password,
        };

        await signup(signupData);
        navigate('/', {replace: true});
    } catch (err) {
        const status = err.response?.status;

        setError(
            status === 400 || status ===409
            ? err.response?.data?.error || err.response?.data?.message || 'Please check your input and try again'
            :!err.response
                ?'Network error. Please check your internet connection and try again'
                :'Could not create account. Please try again shortly.'
        );
    } finally {
        setSubmitting(false);
    }
};