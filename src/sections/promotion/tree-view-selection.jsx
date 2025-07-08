import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardHeader,
  Divider,
  Stack,
  Skeleton,
  Typography,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view';
import { selectProductType } from 'src/state/product-type/product-type.slice';
import { getProductTypesAsync } from 'src/services/product-type/product-type.service';
import { useFormContext, Controller } from 'react-hook-form';

export function TreeViewSelection() {
  const { control, setValue, watch, trigger } = useFormContext();
  const [expandedItems, setExpandedItems] = useState([]);

  const dispatch = useDispatch();

  const {
    promotion: { items, loading },
  } = useSelector(selectProductType);

  useEffect(() => {
    dispatch(getProductTypesAsync());
  }, [dispatch]); // Get all parent IDs that need to be expanded to show selected items
  const getParentIdsForExpansion = useCallback((selectedIds, allItems) => {
    // Safety check: ensure selectedIds is an array
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return [];
    }

    const parentIdsToExpand = new Set();

    selectedIds.forEach((selectedId) => {
      const parentIds = getAllParentIds(selectedId, allItems);
      parentIds.forEach((parentId) => parentIdsToExpand.add(parentId));
    });
    return Array.from(parentIdsToExpand);
  }, []);
  useEffect(() => {
    const currentSelectedItems = watch('applyToProductTypeIdsList') || [];
    // Ensure currentSelectedItems is an array and has items
    if (
      items &&
      items.length > 0 &&
      Array.isArray(currentSelectedItems) &&
      currentSelectedItems.length > 0
    ) {
      const parentsToExpand = getParentIdsForExpansion(
        currentSelectedItems,
        items,
      );
      setExpandedItems(parentsToExpand);
    }
  }, [watch, items, getParentIdsForExpansion]);

  // Get all children IDs recursively
  const getAllChildrenIds = (nodeId, allItems) => {
    const findNode = (itemsArray, id) => {
      const found = itemsArray.find((item) => item.id === id);
      if (found) return found;

      return itemsArray.reduce((result, item) => {
        if (result) return result;
        if (item.children) {
          return findNode(item.children, id);
        }
        return null;
      }, null);
    };

    const node = findNode(allItems, nodeId);
    if (!node?.children) return [];

    const childrenIds = [];
    const collectChildren = (children) => {
      children.forEach((child) => {
        childrenIds.push(child.id);
        if (child.children) {
          collectChildren(child.children);
        }
      });
    };
    collectChildren(node.children);
    return childrenIds;
  };
  // Get all parent IDs recursively (from child to root)
  const getAllParentIds = (nodeId, allItems) => {
    const findParent = (itemsArray, targetId, parentId = null) => {
      const directMatch = itemsArray.find((item) => item.id === targetId);
      if (directMatch) return parentId;

      return itemsArray.reduce((result, item) => {
        if (result !== null) return result;
        if (item.children) {
          return findParent(item.children, targetId, item.id);
        }
        return null;
      }, null);
    };
    const parentIds = [];
    const currentId = nodeId;
    let iterations = 0;
    const maxIterations = 100; // Safety limit to prevent infinite loops

    const getNextParent = (id) => {
      iterations += 1;
      if (iterations > maxIterations) return null;

      const parentId = findParent(allItems, id);
      if (!parentId) return null;

      parentIds.push(parentId);
      return getNextParent(parentId);
    };

    getNextParent(currentId);
    return parentIds;
  };

  // Helper function to check if all children are selected
  const areAllChildrenSelected = (item, selection) => {
    if (!item.children?.length) return false;
    return item.children.every((child) => selection.includes(child.id));
  };

  // Helper function to check if any child is unselected
  const isAnyChildUnselected = (item, selection) => {
    if (!item.children?.length) return false;
    return item.children.some((child) => !selection.includes(child.id));
  };
  // Collect parents that should be selected
  const collectParentsToSelect = (itemList, selection) => {
    const toSelect = [];

    const traverse = (itemsArray) => {
      itemsArray.forEach((item) => {
        if (
          areAllChildrenSelected(item, selection) &&
          !selection.includes(item.id)
        ) {
          toSelect.push(item.id);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };

    traverse(itemList);
    return toSelect;
  };
  // Collect parents that should be deselected
  const collectParentsToDeselect = (itemList, selection) => {
    const toDeselect = [];

    const traverse = (itemsArray) => {
      itemsArray.forEach((item) => {
        if (
          selection.includes(item.id) &&
          isAnyChildUnselected(item, selection)
        ) {
          toDeselect.push(item.id);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };

    traverse(itemList);
    return toDeselect;
  };

  // Handle selection changes with parent-child logic
  const handleSelectionChange = (event, nodeIds, currentSelected) => {
    const newSelectedIds = Array.isArray(nodeIds) ? [...nodeIds] : [nodeIds];

    // Find what changed (added or removed)
    const added = newSelectedIds.filter((id) => !currentSelected.includes(id));
    const removed = currentSelected.filter(
      (id) => !newSelectedIds.includes(id),
    );

    let finalSelection = [...newSelectedIds];

    // Handle added selections - when parent is checked, check all children
    added.forEach((nodeId) => {
      if (nodeId) {
        const childrenIds = getAllChildrenIds(nodeId, items);
        childrenIds.forEach((childId) => {
          if (!finalSelection.includes(childId)) {
            finalSelection.push(childId);
          }
        });
      }
    }); // Handle removed selections - when any node is unchecked, uncheck all children AND all parents
    removed.forEach((nodeId) => {
      if (nodeId) {
        // Remove all children when any node is unchecked
        const childrenIds = getAllChildrenIds(nodeId, items);
        finalSelection = finalSelection.filter(
          (id) => !childrenIds.includes(id),
        );

        // Remove all parents when any child is unchecked
        const parentIds = getAllParentIds(nodeId, items);
        finalSelection = finalSelection.filter((id) => !parentIds.includes(id));
      }
    }); // Auto-check parents when ALL children are checked
    const autoSelectParents = (selection) => {
      let updated = [...selection];
      let hasChanges = true;

      while (hasChanges) {
        const parentsToSelect = collectParentsToSelect(items, updated);
        hasChanges = parentsToSelect.length > 0;
        updated = [...updated, ...parentsToSelect];
      }

      return updated;
    };

    // Auto-uncheck parents when ANY child is unchecked
    const autoDeselectParents = (selection) => {
      let updated = [...selection];
      let hasChanges = true;

      while (hasChanges) {
        const parentsToDeselect = collectParentsToDeselect(items, updated);
        hasChanges = parentsToDeselect.length > 0;
        updated = updated.filter((id) => !parentsToDeselect.includes(id));
      }

      return updated;
    };

    // Apply parent-child logic
    finalSelection = autoSelectParents(finalSelection);
    finalSelection = autoDeselectParents(finalSelection); // Filter out any undefined or null values
    const validIds = finalSelection.filter((id) => id != null);
    setValue('applyToProductTypeIdsList', validIds);
    // Trigger validation for the field to show/hide error messages
    trigger('applyToProductTypeIdsList');
  };

  return (
    <Card>
      <CardHeader
        title="Sản phẩm áp dụng"
        subheader="Chọn các loại sản phẩm áp dụng khuyến mãi"
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {loading ? (
          <Stack spacing={1}>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={40} />
          </Stack>
        ) : (
          <Stack spacing={1}>
            {' '}
            <Controller
              name="applyToProductTypeIdsList"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <RichTreeView
                    items={items}
                    sx={{
                      overflowX: 'hidden',
                      minHeight: 240,
                      width: 1,
                      ...(error && {
                        border: 1,
                        borderColor: 'error.main',
                        borderRadius: 1,
                      }),
                    }}
                    checkboxSelection
                    multiSelect
                    selectedItems={field.value || []}
                    expandedItems={expandedItems}
                    onExpandedItemsChange={(event, itemIds) =>
                      setExpandedItems(itemIds)
                    }
                    onSelectedItemsChange={(event, nodeIds) =>
                      handleSelectionChange(event, nodeIds, field.value || [])
                    }
                  />
                  {error && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'error.main',
                        mt: 0.5,
                        ml: 1,
                      }}
                    >
                      {error.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
