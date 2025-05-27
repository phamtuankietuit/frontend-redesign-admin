import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: 'Tổng quan',
    items: [
      {
        title: 'Báo cáo',
        path: '/',
        icon: ICONS.analytics,
      },
    ],
  },
  {
    subheader: 'Quản lý',
    items: [
      {
        title: 'Khách hàng',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Danh sách khách hàng', path: paths.dashboard.user.list },
        ],
      },
      {
        title: 'Chi nhánh',
        path: paths.dashboard.branch.root,
        icon: ICONS.tour,
        children: [
          { title: 'Danh sách chi nhánh', path: paths.dashboard.branch.root },
        ],
      },
      {
        title: 'Sản phẩm',
        path: paths.dashboard.product.root,
        icon: ICONS.product,
        children: [
          { title: 'Danh sách sản phẩm', path: paths.dashboard.product.root },
          { title: 'Loại sản phẩm', path: paths.dashboard.product.productType },
        ],
      },
      // {
      //   title: 'Tồn kho',
      //   path: paths.dashboard.inventory.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'Danh sách sản phẩm', path: paths.dashboard.inventory.root },
      //   ],
      // },
      {
        title: 'Cập nhật tồn kho',
        path: paths.dashboard.stockAdjustment.root,
        icon: ICONS.invoice,
        children: [
          {
            title: 'Đơn cập nhật tồn kho',
            path: paths.dashboard.stockAdjustment.root,
          },
        ],
      },
      {
        title: 'Đơn hàng',
        path: paths.dashboard.order.root,
        icon: ICONS.order,
        children: [
          { title: 'Danh sách đơn hàng', path: paths.dashboard.order.root },
        ],
      },
      {
        title: 'Khuyến mãi',
        path: paths.dashboard.promotion.root,
        icon: ICONS.parameter,
        children: [
          {
            title: 'Danh sách khuyến mãi',
            path: paths.dashboard.promotion.root,
          },
        ],
      },
      {
        title: 'Chat',
        path: paths.dashboard.chat.root,
        icon: ICONS.chat,
        children: [
          {
            title: 'Chat',
            path: paths.dashboard.chat.root,
          },
          {
            title: 'Tin nhắn nhanh',
            path: paths.dashboard.chat.list,
          },
        ],
      },
    ],
  },
];
