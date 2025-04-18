import { Controller } from 'react-hook-form';

import { styled } from '@mui/material/styles';
import { FormHelperText } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { varAlpha, stylesMode } from 'src/theme/styles';

// ----------------------------------------------------------------------

const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.vars.palette.grey[800],
  [stylesMode.dark]: { color: theme.vars.palette.grey[200] },
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: { fontSize: '0.8rem', fontWeight: 500 },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.25),
    [stylesMode.dark]: {
      color: theme.vars.palette.primary.contrastText,
      backgroundColor: theme.vars.palette.primary.dark,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${varAlpha(theme.vars.palette.text.primaryChannel, 0.4)}`,
  },
}));

export function CustomStyling({ name, items, control, ...other }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <RichTreeView
            aria-label="customized"
            sx={{ overflowX: 'hidden', minHeight: 240, width: 1 }}
            slots={{ item: StyledTreeItem }}
            items={items}
            selectedItems={value ? [value.toString()] : []}
            onSelectedItemsChange={(_, itemId) => {
              onChange(itemId);
            }}
            expansionTrigger="iconContainer"
            {...other}
          />
          <FormHelperText error={!!error} sx={{ textAlign: 'left' }}>
            {error?.message}
          </FormHelperText>
        </>
      )}
    />
  );
}
