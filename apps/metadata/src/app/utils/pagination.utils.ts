export interface PaginateConfig {
  offset: number,
  limit: number,
}

export interface ResponsePaginate {
  payload: any,
  pagination: {
    previous?: number,
    self: number,
    next?: number,
    limit: number,
    total: number,
  },
}

export const getPagination = async (model: any, page: number, limit): Promise<ResponsePaginate> => {
  try {
    let config: PaginateConfig = { offset: 0, limit }
    if (page > 1) {
      config = {
        offset: ((page - 1) * limit),
        limit,
      }
    }

    const total: number = await model.count();
    const data = await model.find().skip(config.offset).limit(config.limit).exec();
    const response: ResponsePaginate = {
      payload: data,
      pagination: {
        previous: page > 1 ? page - 1 : undefined,
        self: page,
        next: total - (page * limit) >= limit ? page + 1 : undefined,
        limit,
        total,
      },
    }
    return response
  } catch {
    return null
  }
}