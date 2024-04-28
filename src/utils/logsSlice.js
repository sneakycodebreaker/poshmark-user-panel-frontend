import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: [],
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addingLogs: (state, action) => {
        state.value.push(action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const {addingLogs } = counterSlice.actions

export default counterSlice.reducer