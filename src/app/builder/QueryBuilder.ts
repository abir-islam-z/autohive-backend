import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

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
    const sortOrder = (this?.query?.sortOrder as 'asc' | 'desc') || 'asc';
    this.modelQuery = this.modelQuery.sort({ [sortBy as string]: sortOrder });

    return this;
  }

  filter() {
    const author = this?.query?.filter;

    if (author) {
      this.modelQuery = this.modelQuery.find({ author });
    }

    return this;
  }
}

export default QueryBuilder;
