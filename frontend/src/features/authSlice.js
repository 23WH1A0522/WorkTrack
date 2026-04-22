import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("worktrack_user");
const storedToken = localStorage.getItem("worktrack_token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("worktrack_user", JSON.stringify(action.payload.user));
      localStorage.setItem("worktrack_token", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = "";
      localStorage.removeItem("worktrack_user");
      localStorage.removeItem("worktrack_token");
      localStorage.removeItem("currentWorkspaceId");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
