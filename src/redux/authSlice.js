import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/auth`;

export const signup = createAsyncThunk('auth/signup', async ({ username, password }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data.message);
        return data;
    } 
    catch (err) {
        return rejectWithValue(err.message);
    }
});

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) return rejectWithValue(data.message);
        return data;
    } 
    catch (err) {
        return rejectWithValue(err.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        username: localStorage.getItem('username') || null,
        status: 'idle',
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.token = null;
            state.username = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => { 
                state.status = 'loading'; 
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.username = action.payload.username;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('username', action.payload.username);
            })
            .addCase(signup.rejected, (state, action) => { 
                state.status = 'failed';
                state.error = action.payload; 
            })
            .addCase(login.pending, (state) => { 
                state.status = 'loading'; 
                state.error = null; 
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                state.username = action.payload.username;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('username', action.payload.username);
            })
            .addCase(login.rejected, (state, action) => { 
                state.status = 'failed'; 
                state.error = action.payload; 
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;