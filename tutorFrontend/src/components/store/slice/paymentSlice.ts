import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


interface SubscriptionState {
  subscriptionId: string | null;
  loading: boolean;
  error: string | null;
  message: string | null; // Optional: for success messages or other notifications
}

const initialState: SubscriptionState = {
  subscriptionId: null,
  loading: false,
  error: null,
  message: null, // Optional: for success messages or other notifications
};

// Async thunk to fetch subscription ID from the backend
export const fetchSubscriptionId = createAsyncThunk(
  'subscription/fetchSubscriptionId',
  async () => {
    const res = await fetch(`http://localhost:10000/api/payment/subscribe`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.subscriptionId;
    } else {
      throw new Error(data.message || 'Failed to fetch subscriptionId');
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancelSubscription',
  async () => {
    const res = await fetch(`http://localhost:10000/api/payment/subscribe/cancel`, {
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
      throw new Error(data.message || 'Failed to CancelSubscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionId.pending, (state) => {
        state.loading = true;
      
      })
      .addCase(fetchSubscriptionId.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionId = action.payload;
      })
      .addCase(fetchSubscriptionId.rejected, (state,) => {
        state.loading = false;
       
      })

      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
       state.loading = false;
        state.subscriptionId = null; // Clear subscription ID on successful cancellation
        state.message = action.payload.message || 'Subscription cancelled successfully';
        state.error = null; // Clear error on successful cancellation
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
       state.loading = false;
        state.subscriptionId = null; // Clear subscription ID on failed cancellation
        state.message = null;
        state.error = action.error.message ?? null;
      });
  },
});

export default subscriptionSlice.reducer;