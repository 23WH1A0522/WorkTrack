import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: "",
};

const selectCurrentWorkspace = (workspaces) => {
  const storedId = localStorage.getItem("currentWorkspaceId");
  return workspaces.find((workspace) => workspace.id === storedId) || workspaces[0] || null;
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setWorkspaceError(state, action) {
      state.error = action.payload;
    },
    hydrateWorkspaces(state, action) {
      state.workspaces = action.payload;
      state.currentWorkspace = selectCurrentWorkspace(action.payload);
      state.error = "";
    },
    setCurrentWorkspace(state, action) {
      localStorage.setItem("currentWorkspaceId", action.payload);
      state.currentWorkspace = state.workspaces.find((workspace) => workspace.id === action.payload) || null;
    },
    addWorkspace(state, action) {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;
      localStorage.setItem("currentWorkspaceId", action.payload.id);
    },
    upsertWorkspace(state, action) {
      const exists = state.workspaces.some((workspace) => workspace.id === action.payload.id);
      state.workspaces = exists
        ? state.workspaces.map((workspace) =>
            workspace.id === action.payload.id ? action.payload : workspace
          )
        : [...state.workspaces, action.payload];

      if (state.currentWorkspace?.id === action.payload.id) {
        state.currentWorkspace = action.payload;
      }
    },
    addProject(state, action) {
      const workspace = state.workspaces.find((item) => item.id === action.payload.workspaceId);
      if (workspace) {
        workspace.projects.push(action.payload.project);
      }
      if (state.currentWorkspace?.id === action.payload.workspaceId) {
        state.currentWorkspace = state.workspaces.find((item) => item.id === action.payload.workspaceId) || null;
      }
    },
    updateProject(state, action) {
      state.workspaces = state.workspaces.map((workspace) => ({
        ...workspace,
        projects: workspace.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      }));
      state.currentWorkspace = selectCurrentWorkspace(state.workspaces);
    },
    addTask(state, action) {
      state.workspaces = state.workspaces.map((workspace) => ({
        ...workspace,
        projects: workspace.projects.map((project) =>
          project.id === action.payload.projectId
            ? { ...project, tasks: [...project.tasks, action.payload] }
            : project
        ),
      }));
      state.currentWorkspace = selectCurrentWorkspace(state.workspaces);
    },
    updateTask(state, action) {
      state.workspaces = state.workspaces.map((workspace) => ({
        ...workspace,
        projects: workspace.projects.map((project) =>
          project.id === action.payload.projectId
            ? {
                ...project,
                tasks: project.tasks.map((task) =>
                  task.id === action.payload.id ? action.payload : task
                ),
              }
            : project
        ),
      }));
      state.currentWorkspace = selectCurrentWorkspace(state.workspaces);
    },
    deleteTask(state, action) {
      const taskIds = action.payload.taskIds || action.payload;
      state.workspaces = state.workspaces.map((workspace) => ({
        ...workspace,
        projects: workspace.projects.map((project) => ({
          ...project,
          tasks: project.tasks.filter((task) => !taskIds.includes(task.id)),
        })),
      }));
      state.currentWorkspace = selectCurrentWorkspace(state.workspaces);
    },
  },
});

export const {
  setLoading,
  setWorkspaceError,
  hydrateWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  upsertWorkspace,
  addProject,
  updateProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
