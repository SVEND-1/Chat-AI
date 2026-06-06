import React from 'react';
import '../../style/payment-history/Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   currentPage,
                                                   totalPages,
                                                   onPageChange,
                                                   isLoading = false
                                               }) => {
    return (
        <div className="pagination">
            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
            >
                ←
            </button>

            <span className="pagination__info">
                {currentPage} / {totalPages}
            </span>

            <button
                className="pagination__button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
            >
                {isLoading ? '...' : '→'}
            </button>
        </div>
    );
};

export default Pagination;