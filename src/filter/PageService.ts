import { DataSource, SelectQueryBuilder } from 'typeorm';
import { PaginationFilterDto } from './PaginationFilterDto';

export class PageService<T> {
  protected readonly dataSource: DataSource;
  constructor(
    dataSource: DataSource,
    private readonly entity: new () => T,
  ) {
    this.dataSource = dataSource;
  }

  protected async paginate(
    filter: PaginationFilterDto,
    queryBuilder: SelectQueryBuilder<T>,
  ): Promise<{
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const { page, pageSize, orderBy, sortOrder } = filter;

    // Apply sorting if specified
    if (orderBy) {
      queryBuilder.orderBy(orderBy, sortOrder);
    }

    // Apply pagination
    queryBuilder.skip((page - 1) * pageSize).take(pageSize);

    const [data, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }

  protected getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.dataSource.createQueryBuilder(this.entity, alias);
  }
}
