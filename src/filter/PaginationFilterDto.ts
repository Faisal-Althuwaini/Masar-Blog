import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';

// Enum for sortOrder to restrict values to 'ASC' or 'DESC'
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationFilterDto {
  // Optional page number (defaults to 1 if not provided)
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  // Optional page size (defaults to 10 if not provided)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  // Optional sorting field (like 'title', 'date', etc.)
  @IsOptional()
  @IsString()
  orderBy: string;

  // Optional sorting order: 'ASC' or 'DESC'
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC; // Default to 'ASC' if not provided

  // Optional filter by title
  @IsOptional()
  @IsString()
  title?: string;
}
