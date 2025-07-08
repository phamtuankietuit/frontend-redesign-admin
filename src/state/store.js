import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/auth.slice';
import chatReducer from './chat/chat.slice';
import branchReducer from './branch/branch.slice';
import productReducer from './product/product.slice';
import addressReducer from './address/address.slice';
import productTypeReducer from './product-type/product-type.slice';
import fastMessageReducer from './fast-message/fast-message.slice';
import stockAdjustmentReducer from './stock-adjustment/stock-adjustment.slice';
import userReducer from './user/user.slice';
import customerTypeReducer from './customer-type/customer-type.slice';
import stockReducer from './stock/stock.slice';
import ratingReducer from './rating/rating.slice';
import stockTransferReducer from './stock-transfer/stock-transfer.slice';
import promotionReducer from './promotion/promotion.slice';
import bannerReducer from './banner/banner.slice';
import orderReducer from './order/order.slice';
import dashboardReducer from './dashboard/dashboard.slice';

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
        user: userReducer,
        customerType: customerTypeReducer,
        stock: stockReducer, rating: ratingReducer,
        stockTransfer: stockTransferReducer,
        promotion: promotionReducer,
        banner: bannerReducer,
        order: orderReducer,
        dashboard: dashboardReducer,
    }
});

export default store;