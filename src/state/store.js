import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import productReducer from './product/product.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
    }
});

export default store; 