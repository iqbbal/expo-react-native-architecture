import { injectable, inject } from "inversiland";
import { makeAutoObservable } from "mobx";
import GetPostsStoreState from "../../types/GetPostsStoreState";
import GetPostsPayload from "src/post/application/types/GetPostsPayload";
import GetPostsUseCase from "src/post/application/useCases/GetPostsUseCase";

@injectable()
export class GetPostsStore implements GetPostsStoreState {
  isLoading = false;
  isLoadingMore = false;
  isRefreshing = false;
  results = [] as GetPostsStoreState["results"];
  total = 0;
  filters = {};
  pagination = {
    page: 1,
    pageSize: 10,  // Changed to 10 for pagination
  };

  constructor(
    @inject(GetPostsUseCase)
    private readonly getPostsUseCase: GetPostsUseCase
  ) {
    makeAutoObservable(this);
  }

  get pageCount() {
    return Math.ceil(this.total / this.pagination.pageSize);
  }

  get isEmpty(): boolean {
    return this.results.length === 0;
  }

  get hasMore(): boolean {
    return this.results.length < this.total;
  }

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setIsLoadingMore = (isLoadingMore: boolean) => {
    this.isLoadingMore = isLoadingMore;
  };

  setIsRefreshing = (isRefreshing: boolean) => {
    this.isRefreshing = isRefreshing;
  };

  setResults = (results: GetPostsStoreState["results"]) => {
    this.results = results;
  };

  appendResults = (results: GetPostsStoreState["results"]) => {
    this.results = [...this.results, ...results];
  };

  setTotal = (total: GetPostsStoreState["total"]) => {
    this.total = total;
  };

  mergeFilters = (payload: Partial<GetPostsStoreState["filters"]>) => {
    Object.assign(this.filters, payload);
  };

  mergePagination = (
    payload: Partial<GetPostsStoreState["pagination"]>
  ): void => {
    Object.assign(this.pagination, payload);
  };

  reset = () => {
    this.pagination.page = 1;
    this.results = [];
    this.total = 0;
  };

  async getPosts() {
    const payload: GetPostsPayload = {
      ...this.filters,
      ...this.pagination,
    };

    console.log("🔵 GetPostsStore.getPosts() - payload:", payload);
    this.setIsLoading(true);

    return this.getPostsUseCase
      .execute(payload)
      .then((response) => {
        console.log("🟢 GetPostsStore - received response:", {
          resultsCount: response.results.length,
          total: response.total,
          skip: response.skip,
          limit: response.limit,
        });
        this.setResults(response.results);
        this.setTotal(response.total);
      })
      .catch((error) => {
        console.error("🔴 GetPostsStore - error:", error);
        throw error;
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  }

  async refresh() {
    console.log("🔄 GetPostsStore.refresh() - resetting pagination");
    
    // Reset pagination to page 1
    this.pagination.page = 1;

    const payload: GetPostsPayload = {
      ...this.filters,
      ...this.pagination,
    };

    this.setIsRefreshing(true);

    return this.getPostsUseCase
      .execute(payload)
      .then((response) => {
        console.log("🟢 GetPostsStore.refresh() - received response:", {
          resultsCount: response.results.length,
          total: response.total,
        });
        // Replace results (not append)
        this.setResults(response.results);
        this.setTotal(response.total);
      })
      .catch((error) => {
        console.error("🔴 GetPostsStore.refresh() - error:", error);
        throw error;
      })
      .finally(() => {
        this.setIsRefreshing(false);
      });
  }

  async loadMore() {
    if (this.isLoadingMore || !this.hasMore) {
      return;
    }

    this.pagination.page += 1;

    const payload: GetPostsPayload = {
      ...this.filters,
      ...this.pagination,
    };

    this.setIsLoadingMore(true);

    return this.getPostsUseCase
      .execute(payload)
      .then((response) => {
        this.appendResults(response.results);
        this.setTotal(response.total);
      })
      .finally(() => {
        this.setIsLoadingMore(false);
      });
  }
}
