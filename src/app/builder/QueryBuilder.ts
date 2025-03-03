import { FilterQuery, Query } from 'mongoose';

// /api/orders?search=&status=All&sortBy=status&sortDirection=desc&page=1&limit=10
// GET /api/cars?search=fsd&page=1&limit=10
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search by fields
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.search;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          field =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  sort() {
    const sortBy = this?.query?.sortBy || 'createdAt';
    const sortOrder = (this?.query?.sortOrder as 'asc' | 'desc') || 'desc';
    this.modelQuery = this.modelQuery.sort({ [sortBy as string]: sortOrder });

    return this;
  }

  paginate() {
    let page = parseInt(this?.query?.page as string, 10) || 1;

    if (page < 1) {
      page = 1;
    }

    const limit = parseInt(this?.query?.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
