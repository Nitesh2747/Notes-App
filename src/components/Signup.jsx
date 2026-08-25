import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router';
import toast from 'react-hot-toast';
import { signup } from '../redux/authSlice';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signup({ username, password }));
        if (signup.fulfilled.match(result)) {
            toast.success('Account created!');
            navigate('/');
        } else {
            toast.error(result.payload || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <h2 className="text-xl font-bold">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" disabled={status === 'loading'} className="bg-black text-white p-2 rounded">
                    {status === 'loading' ? 'Creating account...' : 'Sign up'}
                </button>
                <p className="text-sm">
                    Already have an account? <Link to="/login" className="underline">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;