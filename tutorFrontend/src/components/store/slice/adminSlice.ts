import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: { url: string };
  createdAt: string;
  subscription: {
    status: string;
    id: string;
  }
}

interface DashboardRecord {
  users: number;
  subscriptions: number;
  views: number;
}

interface DashboardStats {
  perYearRecord: DashboardRecord[]; // Replace `any` with the specific type if known
  usersCount: number;
  viewsCount: number;
  subscriptionCount: number;
  userPercentage: number;
  viewsPercentage: number;
  subscriptionPercentage: number;
  userProfit: boolean;
  viewsProfit: boolean;
  subscriptionProfit: boolean;
}

interface AdminState {
  dashboardStats: DashboardStats | null; // Optional: for dashboard stats
  users: User[];
  loading: boolean;
  error: string | null;
  message: string | null; // Optional: for success messages or other notifications
}

const initialState: AdminState = {
  dashboardStats: null, // Optional: for dashboard stats
  users: [],
  loading: false,
  error: null,
  message: null, // Optional: for success messages or other notifications
};



// AsyncThunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async () => {
    const res = await fetch(`http://localhost:3000/api/auth/admin/getalluser`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({id}:{id:string}) => {
    const res = await fetch(`http://localhost:3000/api/auth/admin/user/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to change user role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async ({id}:{id:string}) => {
    const res = await fetch(`http://localhost:3000/api/auth/admin/deleteuser/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to delete user');
    }
  }
);

export const dashboardStatus = createAsyncThunk(
  'admin/dashboardStatus',
  async () => {
    const res = await fetch(`http://localhost:3000/api/dashboard/dashboardstats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to delete user');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "failed to fetch users";
      })

      .addCase(changeUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.loading = false;
        // state.users = action.payload.users;
        state.message = action.payload.message
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "failed to change user role";
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.users = action.payload.users;
        state.message = action.payload.message
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "failed to delete users";
      })

      .addCase(dashboardStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.dashboardData;   
        

      })
      .addCase(dashboardStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "failed to delete users";
      });
  },
});

export default adminSlice.reducer;