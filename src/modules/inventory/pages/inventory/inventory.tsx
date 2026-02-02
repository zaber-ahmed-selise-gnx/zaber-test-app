import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdvanceDataTable from '../../component/advance-data-table/advance-data-table';
import { AdvanceExpandRowContent } from '../../component/advance-expand-row-content/advance-expand-row-content';
import { AdvancedTableColumnsToolbar } from '../../component/advance-table-columns-toolbar/advance-table-columns-toolbar';
import { createAdvanceTableColumns } from '../../component/advance-table-columns/advance-table-columns';
import { AdvanceTableFilterToolbar } from '../../component/advance-table-filter-toolbar/advance-table-filter-toolbar';
import { useGetInventories } from '../../hooks/use-inventory';
import { InventoryItem } from '../../types/inventory.types';
import { DataError } from '@/components/core/data-error/data-error';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export const InventoryPage = () => {
  const { t } = useTranslation();
  const columns = createAdvanceTableColumns({ t });
  const navigate = useNavigate();
  const [inventoryTableData, setInventoryTableData] = useState<InventoryItem[]>([]);
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    isRefetching: isRefetchingInventory,
    error: inventoryError,
    refetch,
  } = useGetInventories({
    pageNo: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize,
  });
  const data = inventoryData as { getInventoryItems: any };

  const handleRetry = () => {
    refetch();
  };

  useEffect(() => {
    if (data?.getInventoryItems?.items) {
      const inventoryDataMap = data.getInventoryItems.items.map((item: InventoryItem) => ({
        ItemId: item.ItemId,
        Category: item.Category,
        CreatedBy: item.CreatedBy,
        CreatedDate: item.CreatedDate,
        IsDeleted: item.IsDeleted,
        ItemImageFileId: item.ItemImageFileId,
        ItemImageFileIds: item.ItemImageFileIds,
        ItemLoc: item.ItemLoc,
        ItemName: item.ItemName,
        Language: item.Language,
        LastUpdatedBy: item.LastUpdatedBy,
        LastUpdatedDate: item.LastUpdatedDate,
        OrganizationIds: item.OrganizationIds,
        Price: item.Price,
        Status: item.Status,
        Stock: item.Stock,
        Supplier: item.Supplier,
        Tags: item.Tags,
        EligibleWarranty: item.EligibleWarranty,
        EligibleReplacement: item.EligibleReplacement,
        Discount: item.Discount,
      }));
      setInventoryTableData(inventoryDataMap);
      setPaginationState((prev) => ({
        ...prev,
        totalCount: data.getInventoryItems.totalCount ?? 0,
      }));
    }
  }, [data]);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      setPaginationState((prev) => ({
        ...prev,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      }));
    },
    []
  );

  const handleInventoryDetails = (item: InventoryItem) => {
    navigate(`/inventory/${item.ItemId}`);
  };

  const renderColumnsToolbar = (table: Table<InventoryItem>) => (
    <AdvancedTableColumnsToolbar
      disabledColumns={['ItemName', 'Stock', 'Price', 'Status']}
      table={table}
      title="INVENTORY"
    />
  );

  const renderExpandRowContent = (rowId: string, colSpan: number) => (
    <AdvanceExpandRowContent rowId={rowId} colSpan={colSpan} data={inventoryTableData} />
  );

  const renderFilterToolbar = (table: Table<InventoryItem>) => (
    <AdvanceTableFilterToolbar table={table} />
  );

  // Show error state with retry option
  if (isInventoryLoading || inventoryError) {
    return (
      <DataError
        error={inventoryError}
        isLoading={isRefetchingInventory}
        onRetry={handleRetry}
        onGoBack={() => navigate(-1)}
        title={t('ERROR_LOADING_INVENTORY') || 'Unable to Load Inventory'}
        possibleCauses={[
          'The inventory schema may not be configured on the backend',
          'Network connectivity issues',
          'Server maintenance or temporary outage',
        ]}
      />
    );
  }

  return (
    <div className="flex w-full flex-col">
      <AdvanceDataTable
        data={inventoryTableData}
        columns={columns}
        onRowClick={handleInventoryDetails}
        isLoading={isInventoryLoading}
        error={null}
        columnsToolbar={renderColumnsToolbar}
        filterToolbar={renderFilterToolbar}
        expandRowContent={renderExpandRowContent}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: paginationState.totalCount,
        }}
        manualPagination={true}
        columnPinningConfig={{ left: ['select', 'ItemName'] }}
        onPaginationChange={handlePaginationChange}
      />
    </div>
  );
};
