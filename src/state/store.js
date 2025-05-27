import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import chatReducer from './chat/chat.slice';
import branchReducer from './branch/branch.slice';
import productReducer from './product/product.slice';
import addressReducer from './address/address.slice';
import productTypeReducer from './product-type/product-type.slice';
import fastMessageReducer from './fast-message/fast-message.slice';
import stockAdjustmentReducer from './stock-adjustment/stock-adjustment.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        chat: chatReducer,
        productType: productTypeReducer,
        branch: branchReducer,
        address: addressReducer,
        fastMessage: fastMessageReducer,
        stockAdjustment: stockAdjustmentReducer,
    }
});

export default store; 