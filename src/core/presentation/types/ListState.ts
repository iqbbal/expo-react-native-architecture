import PaginationState from "./PaginationState";

export default interface ListState<
  ResultItemType,
  FiltersType = Record<string, never>
> {
  isLoading: boolean;
  results: ResultItemType[];
  total: number;
  filters: FiltersType;
  pagination: PaginationState;
}
