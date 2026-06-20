import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Inventory/OMS-Dashboard";
import InventoryConsole from "./Inventory/InventoryConsole";
import AdjustInventory from "./Inventory/AdjustInventory";
import InventoryLocation from "./Inventory/InventoryLocation";
import OrderConsole from "./Orders/OrderConsole";
import UpdateOrder from "./Orders/UpdateOrder";

function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventoryConsole" element={<InventoryConsole />} />
            <Route path="/adjustInventory" element={<AdjustInventory />} />
            <Route path="/inventoryLocation" element={<InventoryLocation />} />
            <Route path="/orderConsole" element={<OrderConsole />} />
            <Route path="/updateOrder" element={<UpdateOrder />} />
        </Routes>
    );
}

export default Routing;
