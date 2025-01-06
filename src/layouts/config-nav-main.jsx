import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navData = [
  {
    title: 'DANH MỤC',
    path: '/pages',
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
    children: [
      {
        subheader: 'Sách tiếng Việt',
        items: [
          { title: 'Văn học', path: paths.about },
          { title: 'Kinh tế', path: paths.contact },
          { title: 'Tâm lý - Kỹ năng sống', path: paths.faqs },
          { title: 'Nuôi dạy con', path: paths.pricing },
          { title: 'Sách thiếu nhi', path: paths.payment },
          { title: 'Tiểu sử - Hồi kí', path: paths.maintenance },
          { title: 'Giáo khoa - tham khảo', path: paths.comingSoon },
          { title: 'Sách học ngoại ngữ', path: paths.comingSoon },
        ],
      },
      {
        subheader: 'Foreign Books',
        items: [
          { title: 'Fiction', path: paths.product.root },
          { title: 'Business & Management', path: paths.product.demo.details },
          { title: 'Personal Development', path: paths.product.checkout },
          { title: "Children's Books", path: paths.post.root },
          { title: 'Dictionaries & Languages', path: paths.post.demo.details },
          { title: 'Order language', path: paths.post.demo.details },
        ],
      },
      {
        subheader: 'Văn phòng phẩm',
        items: [
          { title: 'Bút - Viết', path: paths.authDemo.split.signIn },
          { title: 'Dụng cụ học sinh', path: paths.authDemo.split.signUp },
          {
            title: 'Dụng cụ văn phòng',
            path: paths.authDemo.split.resetPassword,
          },
          {
            title: 'Dụng cụ vẽ',
            path: paths.authDemo.split.updatePassword,
          },
          { title: 'Sản phẩm về giấy', path: paths.authDemo.split.verify },
          { title: 'Sản phẩm khác', path: paths.authDemo.centered.signIn },
          { title: 'Sản phẩm điện tử', path: paths.authDemo.centered.signUp },
        ],
      },
      {
        subheader: 'Lưu niệm',
        items: [
          { title: 'Đồ dùng cá nhân', path: paths.page403 },
          { title: 'Đồ điện gia dụng', path: paths.page404 },
          { title: 'Quà tặng', path: paths.page500 },
        ],
      },
    ],
  },
];

export const getConfigNavMain = (productTypes) => {
  const children = productTypes.map((productType) => ({
    subheader: productType.displayName,
    items: productType.childProductTypes.map((childProductType) => ({
      title: childProductType.displayName,
      path: paths.product.root,
    })),
  }));

  return [
    {
      title: 'DANH MỤC',
      path: '/pages',
      icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
      children,
    },
  ];
};
