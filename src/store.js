import { configureStore } from '@reduxjs/toolkit'
import pasteReducer from './redux/pasteSlice'
import authReducer from './redux/authSlice';


export default configureStore({
  reducer: {
    paste: pasteReducer,
    auth: authReducer,
  }
})