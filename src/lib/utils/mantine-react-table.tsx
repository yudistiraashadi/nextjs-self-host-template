import {
  type UseQueryResult,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import {
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton,
  type MRT_RowData,
  type MRT_TableOptions,
  type MRT_TableState,
} from "mantine-react-table";

export function getDefautTableOptions<T extends MRT_RowData>({
  queryResult,
  initialState,
  state,
}: {
  queryResult: UseQueryResult<T[], Error> | UseSuspenseQueryResult<T[], Error>;
  initialState?: Partial<MRT_TableState<T>>;
  state?: Partial<MRT_TableState<T>>;
}): Omit<MRT_TableOptions<T>, "columns" | "data"> {
  return {
    initialState: {
      showGlobalFilter: true,
      density: "xs",
      pagination: { pageSize: 10, pageIndex: 0 },
      ...initialState,
    },
    globalFilterFn: "contains",
    state: {
      isLoading: queryResult.isPending,
      showAlertBanner: queryResult.isError,
      showProgressBars: queryResult.isPending,
      ...state,
    },
    enableColumnFilterModes: true,
    enableHiding: false,
    mantineToolbarAlertBannerProps: queryResult.isError
      ? {
          color: "red",
          title: "Error",
          children: queryResult.error?.message ?? "An error occurred.",
        }
      : undefined,
    renderToolbarInternalActions: ({ table }) => (
      <div className="flex gap-2">
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
      </div>
    ),
  };
}
