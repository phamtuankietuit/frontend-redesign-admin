import { useCallback } from 'react';

import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProductTableToolbar({ filters, options }) {
  const popover = usePopover();

  const local = useSetState({
    publish: filters.state.publish,
  });

  const handleChangePublish = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      local.setState({
        publish: typeof value === 'string' ? value.split(',') : value,
      });
    },
    [local],
  );

  const handleFilterPublish = useCallback(() => {
    filters.setState({ publish: local.state.publish });
  }, [filters, local.state.publish]);

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="product-filter-publish-select-label">
          Hiển thị
        </InputLabel>
        <Select
          multiple
          value={local.state.publish}
          onChange={handleChangePublish}
          onClose={handleFilterPublish}
          input={<OutlinedInput label="Hiển thị" />}
          renderValue={(selected) => {
            const publishLabels = options.publishs.map(
              (option) => option.label,
            );

            const selectedLabels = selected.map(
              (value) =>
                publishLabels[
                  options.publishs.findIndex((option) => option.value === value)
                ],
            );

            return selectedLabels.map((value) => value).join(', ');
          }}
          inputProps={{ id: 'product-filter-publish-select-label' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.publishs.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={local.state.publish.includes(option.value)}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterPublish}
            sx={{
              justifyContent: 'center',
              fontWeight: (theme) => theme.typography.button,
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              bgcolor: (theme) =>
                varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }}
          >
            Áp dụng
          </MenuItem>
        </Select>
      </FormControl>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            In
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Xuất file
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
