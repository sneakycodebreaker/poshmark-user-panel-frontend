import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../utils/logsSlice'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
})