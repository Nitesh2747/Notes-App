import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
const API_URL = `${BASE_URL}/api/pastes`;

const authHeader = (getState) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getState().auth.token}`,
});

export const fetchPastes = createAsyncThunk('paste/fetchPastes', async (_, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(API_URL, { headers: authHeader(getState) });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToPastes = createAsyncThunk('paste/addToPastes', async (paste, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: authHeader(getState),
      body: JSON.stringify({ title: paste.title, content: paste.content, tags: paste.tags }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateToPastes = createAsyncThunk('paste/updateToPastes', async (paste, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/${paste._id}`, {
      method: 'PUT',
      headers: authHeader(getState),
      body: JSON.stringify({ title: paste.title, content: paste.content, tags: paste.tags, isPublic: paste.isPublic }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return { ...data, silent: paste.silent };
  }
  catch (err) {
    return rejectWithValue(err.message);
  }
});

export const removeFromPastes = createAsyncThunk('paste/removeFromPastes', async (pasteId, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/${pasteId}`, {
      method: 'DELETE',
      headers: authHeader(getState),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return pasteId;
  }
  catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchPublicPaste = createAsyncThunk('paste/fetchPublicPaste', async (pasteId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/public/${pasteId}`);
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  }
  catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleShare = createAsyncThunk('paste/toggleShare', async ({ pasteId, isPublic }, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/${pasteId}`, {
      method: 'PUT',
      headers: authHeader(getState),
      body: JSON.stringify({ isPublic }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  }
  catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  pastes: [],
  status: 'idle',
  publicPaste: null,
  publicStatus: 'idle',
}

export const pasteSlice = createSlice({
  name: 'paste',
  initialState,
  reducers: {
    resetAllPastes: (state) => {
      state.pastes = []
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPastes.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchPastes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pastes = action.payload;
      })
      .addCase(fetchPastes.rejected, (state, action) => {
        state.status = 'failed';
        toast.error(action.payload || 'Failed to load notes');
      })
      .addCase(addToPastes.fulfilled, (state, action) => {
        state.pastes.push(action.payload);
        toast.success('Note created successfully');
      })
      .addCase(addToPastes.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to create note');
      })
      .addCase(updateToPastes.fulfilled, (state, action) => {
        const index = state.pastes.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) state.pastes[index] = action.payload;
        if (!action.payload.silent) {
          toast.success('Note updated');
        }
      })
      .addCase(updateToPastes.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update note');
      })
      .addCase(removeFromPastes.fulfilled, (state, action) => {
        const index = state.pastes.findIndex((item) => item._id === action.payload);
        if (index >= 0) state.pastes.splice(index, 1);
        toast.success('Note deleted');
      })
      .addCase(removeFromPastes.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to delete note');
      })
      .addCase(fetchPublicPaste.pending, (state) => {
        state.publicStatus = 'loading';
        state.publicPaste = null;
      })
      .addCase(fetchPublicPaste.fulfilled, (state, action) => {
        state.publicStatus = 'succeeded';
        state.publicPaste = action.payload;
      })
      .addCase(fetchPublicPaste.rejected, (state) => {
        state.publicStatus = 'failed';
        state.publicPaste = null;
      })
      .addCase(toggleShare.fulfilled, (state, action) => {
        const index = state.pastes.findIndex((item) => item._id === action.payload._id);
        if (index >= 0) state.pastes[index] = action.payload;
        toast.success(action.payload.isPublic ? 'Sharing enabled' : 'Sharing disabled');
      })
      .addCase(toggleShare.rejected, (state, action) => {
        toast.error(action.payload || 'Failed to update sharing');
      });
  },
})

export const { resetAllPastes } = pasteSlice.actions

export default pasteSlice.reducer
