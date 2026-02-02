import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table } from '@tanstack/react-table';
import { InvoiceItem } from '../../types/invoices.types';
import InvoicesFilterToolbar from '../../components/invoices-filter-toolbar/invoices-filter-toolbar';
import { createInvoiceTableColumns } from '../../components/invoices-table-column/invoices-table.column';
import { useGetInvoiceItems } from '../../hooks/use-invoices';
import InvoicesHeaderToolbar from '../../components/invoices-header-toolbar/invoices-header-toolbar';
import { InvoicesOverviewTable } from '../../components/invoices-overview-table/invoices-overview-table';
import { DataError } from '@/components/core/data-error/data-error';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

function InvoicesTableToolbar(table: Readonly<Table<InvoiceItem>>) {
  return <InvoicesFilterToolbar table={table} />;
}

export function InvoicesPage() {
  const { t } = useTranslation();
  const columns = createInvoiceTableColumns({ t });
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const {
    data: invoiceDataItems,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useGetInvoiceItems({
    pageNo: paginationState.pageIndex + 1,
    pageSize: paginationState.pageSize,
  });

  const invoiceItems = invoiceDataItems?.items ?? [];
  const totalCount = invoiceDataItems?.totalCount ?? 0;

  /**
   * Handles pagination changes.
   */
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

  const handleInvoicesDetail = (data: InvoiceItem) => {
    navigate(`/invoices/${data.ItemId}`);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading || error) {
    return (
      <DataError
        error={error}
        isLoading={isRefetching}
        onRetry={handleRetry}
        onGoBack={() => navigate(-1)}
        title={t('ERROR_LOADING_INVOICES') || 'Unable to Load Invoices'}
        possibleCauses={[
          'The invoice schema may not be configured on the backend',
          'Network connectivity issues',
          'Server maintenance or temporary outage',
        ]}
      />
    );
  }

  return (
    <div className="flex w-full gap-5 flex-col">
      <InvoicesHeaderToolbar />
      <InvoicesOverviewTable
        data={invoiceItems}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleInvoicesDetail}
        toolbar={InvoicesTableToolbar}
        pagination={{
          pageIndex: paginationState.pageIndex,
          pageSize: paginationState.pageSize,
          totalCount: totalCount,
        }}
        onPaginationChange={handlePaginationChange}
        manualPagination={true}
      />
    </div>
  );
}
