import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/config-global';

import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  // const currentOrder = _orders.find((order) => order.id === id);
  const currentOrder = {
    id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
    orderNumber: 'DH6010',
    createdAt: '2025-01-07T11:15:19+07:00',
    taxes: 0,
    items: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        sku: '16H9UR0',
        quantity: 1,
        name: 'Bố già',
        coverUrl:
          'https://uitbookstorestorage.blob.core.windows.net/images/book-6.webp',
        price: 60000,
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        sku: '16H9UR1',
        quantity: 2,
        name: 'Cô Gái Đến Từ Hôm Qua',
        coverUrl:
          'https://uitbookstorestorage.blob.core.windows.net/images/book-17.webp',
        price: 115000,
      },
    ],
    history: {
      orderTime: '2025-01-06T10:15:19+07:00',
      paymentTime: '2025-01-05T09:15:19+07:00',
      deliveryTime: '2025-01-04T08:15:19+07:00',
      completionTime: '2025-01-03T07:15:19+07:00',
      timeline: [
        {
          title: 'Đã đến kho Quận Đống Đa',
          time: '2025-01-05T09:15:19+07:00',
        },
        {
          title: 'Đã tới kho HN',
          time: '2025-01-04T08:15:19+07:00',
        },
        {
          title: 'Shipper lấy hàng',
          time: '2025-01-03T07:15:19+07:00',
        },
        {
          title: 'Đã đặt hàng',
          time: '2025-01-02T06:15:19+07:00',
        },
      ],
    },
    subtotal: 230000,
    shipping: 10,
    discount: 10,
    customer: {
      id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
      name: 'Nguyễn Văn An',
      email: 'nguyenvana@gmail.com',
      avatarUrl: '/assets/images/mock/avatar/avatar-1.webp',
      ipAddress: '192.158.1.38',
    },
    delivery: {
      shipBy: 'DHL',
      speedy: 'Standard',
      trackingNumber: 'SPX037739199373',
    },
    totalAmount: 229980,
    totalQuantity: 6,
    shippingAddress: {
      fullAddress:
        'Nguyễn Văn An (Nhà ở) 19034 Đường Lê Lợi Căn hộ 164 - Hà Nội, VN',
      phoneNumber: '033500125',
    },
    payment: {
      cardType: 'mastercard',
      cardNumber: '**** **** **** 5678',
    },
    status: 'pending',
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={currentOrder} />
    </>
  );
}
