import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { selectStockAdjustment } from 'src/state/stock-adjustment/stock-adjustment.slice';
import { StockAdjustmentNewEditForm } from '../stock-adjustment-new-edit-form';

// ----------------------------------------------------------------------

export function StockAdjustmentEditView() {
  const {
    createEditPage: { currentStockAdjustment },
  } = useSelector(selectStockAdjustment);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chi tiết đơn cập nhật tồn kho"
        links={[
          { name: 'Trang chủ', href: paths.dashboard.root },
          {
            name: 'Đơn cập nhật tồn kho',
            href: paths.dashboard.stockAdjustment.root,
          },
          { name: currentStockAdjustment?.code },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <StockAdjustmentNewEditForm />
    </DashboardContent>
  );
}
