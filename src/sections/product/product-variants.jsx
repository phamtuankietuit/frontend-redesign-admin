import { useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ProductVariants = ({ control, getValues }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleAddVariant = () => {
    append({
      variantName: '',
      values: [
        {
          value: '',
        },
      ],
    });
  };

  const handleRemoveVariant = (variantIndex) => {
    remove(variantIndex);
  };

  const handleAddValue = (variantIndex) => {
    const currentValues = getValues(`variants`);
    const updatedValues = [
      ...(currentValues[variantIndex].values || []),
      { value: '' },
    ];

    update(variantIndex, {
      ...currentValues[variantIndex],
      values: updatedValues,
    });
  };

  const handleRemoveValue = (variantIndex, valueIndex) => {
    const currentValues = getValues(`variants`);
    const updatedValues = currentValues[variantIndex].values.filter(
      (_, i) => i !== valueIndex,
    );

    update(variantIndex, {
      ...currentValues[variantIndex],
      values: updatedValues,
    });
  };

  return (
    <Box>
      <Stack
        divider={<Divider flexItem sx={{ borderStyle: 'dashed', my: 1 }} />}
        spacing={2}
      >
        {fields?.map((variant, variantIndex) => (
          <Stack key={`${variant.id}`} alignItems="flex-end" spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ width: 1 }}
            >
              <Field.Text
                name={`variants[${variantIndex}].variantName`}
                label="Tên biến thể"
                InputLabelProps={{ shrink: true }}
                sx={{ width: '40%' }}
              />

              <Stack direction="column" spacing={2} sx={{ width: '60%' }}>
                {variant.values.map((value, valueIndex) => (
                  <Stack
                    key={`${variant.id}-${variantIndex}-${valueIndex}`}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Field.Text
                      name={`variants[${variantIndex}].values[${valueIndex}].value`}
                      label="Giá trị"
                      InputLabelProps={{ shrink: true }}
                    />
                    {variant.values.length > 1 && (
                      <IconButton
                        key={`${variant.id}-${variantIndex}-${valueIndex}`}
                        color="error"
                        onClick={() =>
                          handleRemoveValue(variantIndex, valueIndex)
                        }
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    )}
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              width={1}
            >
              <Stack key="delete" direction="row" sx={{ width: '40%' }}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  onClick={() => handleRemoveVariant(variantIndex)}
                >
                  Xóa biến thể
                </Button>
              </Stack>

              <Stack key="addValue" direction="row" sx={{ width: '60%' }}>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={() => handleAddValue(variantIndex)}
                  sx={{ flexShrink: 0 }}
                >
                  Thêm giá trị
                </Button>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>

      {fields.length > 0 && <Divider sx={{ my: 2, borderStyle: 'dashed' }} />}

      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAddVariant}
          sx={{ flexShrink: 0 }}
        >
          Thêm biến thể
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductVariants;
