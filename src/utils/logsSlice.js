import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  follow_back_value: [],
  self_share_value: [],
  share_back_value: [],
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addingSelfShareLogs: (state, action) => {
        state.self_share_value.push(action.payload);
    },
    addingFollowBackLogs: (state, action) => {
      state.follow_back_value.push(action.payload);
    },
    addingShareBackLogs: (state, action) => {
      state.share_back_value.push(action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const {addingSelfShareLogs,addingFollowBackLogs,addingShareBackLogs } = counterSlice.actions

export default counterSlice.reducer