import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URLS } from '../config';

// Async thunk for fetching inventory data
export const fetchInventoryData = createAsyncThunk(
  'inventory/fetchInventoryData',
  async () => {
    const { data } = await axios.get(API_URLS.getInventoryReport);
    return data.data || [];
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventoryData: { totalInventories: 0, availableProducts: 0, reservedProducts: 0 },
    warehouseData: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        const inventory = action.payload || [];  // Ensure action.payload is an array or empty array

        // Calculate the total number of inventories (count of warehouses)
        const totalInventories = inventory.length;

        // Calculate the total available and reserved products across all warehouses
        const totalAvailableProducts = inventory.reduce((sum, item) => sum + (item.availableQuantity || 0), 0);
        const totalReservedProducts = inventory.reduce((sum, item) => sum + (item.reservedQuantity || 0), 0);

        // Update the state with the correct values
        state.inventoryData = {
          totalInventories,  // Number of warehouse IDs
          availableProducts: totalAvailableProducts,  // Sum of available quantities
          reservedProducts: totalReservedProducts,  // Sum of reserved quantities
        };

        // Update the warehouse data
        state.warehouseData = inventory.map(item => ({
          warehouseId: item.warehouseId || 'Unknown',
          availableQty: item.availableQuantity || 0,
          reservedQty: item.reservedQuantity || 0,
          totalQty: item.totalQuantity || 0,
        }));

        state.status = 'succeeded';
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default inventorySlice.reducer;
