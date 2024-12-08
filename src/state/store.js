import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import chatReducer from './chat/chat.slice';
import productReducer from './product/product.slice';
import productTypeReducer from './product-type/product-type.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        chat: chatReducer,
        productType: productTypeReducer,
    }
});

export default store; 