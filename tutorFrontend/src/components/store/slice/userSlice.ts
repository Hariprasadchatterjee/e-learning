import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PlayList {
  poster: string;
  title: string;
  description: string;
  _id: string;
  views: number;
  numOfVideos: number;
  createdBy: { name: string; email: string; avatar: { url: string } };
  createdAt: string;
  category: string;
  lectures: { title: string; description: string; video: { url: string } }[];
  course: string;

}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: { url: string };
  createdAt: string;
  playlist: PlayList[]; // Assuming playlist is an array of course IDs
  subscription: {
    status: string;
    id: string;
  }
  // Add other user properties as needed
}

export interface UserState {
  isLoggedIn: boolean;
  user?: User;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: undefined,
  loading: false,
  message: null,
  error: null,
};

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async ({ formData }: { formData: FormData }) => {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Registration failed");
    }
  }
);

export const fetchLogout = createAsyncThunk(
  'auth/fetchLogout',
  async () => {
    const res = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async () => {
    const res = await fetch('http://localhost:3000/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'auth/updateProfilePicture',
  async ({ formData }: { formData: FormData }) => {
    const res = await fetch('http://localhost:3000/api/auth/upProPic', {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ name, email }: { name: string; email: string }) => {
    const res = await fetch('http://localhost:3000/api/auth/updateprofile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ oldpassword, newpassword }: { oldpassword: string; newpassword: string }) => {
    const res = await fetch('http://localhost:3000/api/auth/changepassword', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ oldpassword, newpassword }),
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
);

export const addToPlaylist = createAsyncThunk(
  'course/addToPlaylist',
  async ({ courseId }: { courseId: string }) => {
    const res = await fetch(`http://localhost:3000/api/auth/addtoplaylist?courseId=${courseId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to Added to playlist');
    }
  }
);

export const removeFromPlaylist = createAsyncThunk(
  'course/removeFromPlaylist',
  async ({ removeId }: { removeId: string }) => {
    const res = await fetch(`http://localhost:3000/api/auth/removefromplaylist?courseId=${removeId}`, {
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
      throw new Error(data.message || 'Failed to Remove from playlist');
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Login failed";
      })

      .addCase(fetchRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Registration failed";
      })

      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.user = undefined;
        state.message = "Logged out successfully";
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Logout failed";
      })

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch profile";
      })

      .addCase(updateProfilePicture.pending, (state) => {

        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {

        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {

        state.error = action.error.message ?? "Failed to update profile picture";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update profile";
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;

        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update profile";
      })

      .addCase(addToPlaylist.pending, (state) => {

        state.error = null;
      })
      .addCase(addToPlaylist.fulfilled, (state, action) => {

        state.message = action.payload.message;
      })
      .addCase(addToPlaylist.rejected, (state, action) => {

        state.error = action.error.message ?? "Failed to Add to playlist";
      })

      .addCase(removeFromPlaylist.pending, (state) => {

        state.error = null;
      })
      .addCase(removeFromPlaylist.fulfilled, (state, action) => {

        state.message = action.payload.message;
      })
      .addCase(removeFromPlaylist.rejected, (state, action) => {

        state.error = action.error.message ?? "Failed to Remove from playlist";
      })
      .addDefaultCase((state) => {
        state.loading = false;
      });
  },
});

export default authSlice.reducer;