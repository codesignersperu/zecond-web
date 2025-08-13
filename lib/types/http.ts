export type HttpResponse<T = {}> = {
  statusCode: number;
  status: "success" | "error";
  message: string;
  data: T;
};

export type HttpErrorResponse = HttpResponse<{}>;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  prevPage: boolean;
  nextPage: boolean;
};

export type PaginationQuery = {
  page?: null | number | string;
  limit?: null | number | string;
};
