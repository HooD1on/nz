'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2; // 当前页面前后显示的页数
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <div className="pagination-container">
        {/* 上一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pagination-button prev ${currentPage === 1 ? 'disabled' : ''}`}
          aria-label="上一页"
        >
          <span className="pagination-arrow">‹</span>
          <span className="pagination-text">上一页</span>
        </button>

        {/* 页码按钮 */}
        <div className="pagination-numbers">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="pagination-dots">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                aria-label={`第 ${page} 页`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pagination-button next ${currentPage === totalPages ? 'disabled' : ''}`}
          aria-label="下一页"
        >
          <span className="pagination-text">下一页</span>
          <span className="pagination-arrow">›</span>
        </button>
      </div>

      {/* 页面信息 */}
      <div className="pagination-info">
        <span>
          第 {currentPage} 页，共 {totalPages} 页
        </span>
      </div>
    </div>
  );
} 