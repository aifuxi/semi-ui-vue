import React, { useState } from 'react';
import type { PaginationProps } from '@semi-v2.102.0/pagination';

export default function PaginationStub({
  currentPage,
  defaultCurrentPage = 1,
  disabled,
  onChange,
  onPageChange,
  pageSize = 10,
  showQuickJumper,
  showSizeChanger,
  showTotal,
  size,
  total = 1,
  ...rest
}: PaginationProps): React.ReactElement {
  const [page, setPage] = useState(currentPage ?? defaultCurrentPage);
  const totalPages = Math.ceil(total / pageSize);
  const change = (next: number) => {
    if (disabled) return;
    if (currentPage === undefined) setPage(next);
    onPageChange?.(next);
    onChange?.(next, pageSize);
  };
  return (
    <div className={`semi-page${size === 'small' ? ' semi-page-small' : ''}`} {...rest}>
      {showTotal ? <span className="semi-page-total">总页数：{totalPages}</span> : null}
      <button
        aria-label="Previous"
        disabled={disabled || page === 1}
        onClick={() => change(page - 1)}
      >
        Prev
      </button>
      <button aria-current="page" aria-label={`Page ${page}`}>
        {page}
      </button>
      <button
        aria-label="Next"
        disabled={disabled || page === totalPages}
        onClick={() => change(page + 1)}
      >
        Next
      </button>
      {showSizeChanger ? <span className="semi-page-switch">Size</span> : null}
      {showQuickJumper ? <span className="semi-page-quickjump">Jump</span> : null}
    </div>
  );
}
