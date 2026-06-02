import React from 'react';
import '../../style/admin/AdminPagination.css';

interface Props {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}

const AdminPagination: React.FC<Props> = ({ page, totalPages, onChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="admin-pagination">
            <button
                className="admin-pagination__btn"
                onClick={() => onChange(page - 1)}
                disabled={page === 0}
            >←</button>
            <span className="admin-pagination__info">{page + 1} / {totalPages}</span>
            <button
                className="admin-pagination__btn"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages - 1}
            >→</button>
        </div>
    );
};

export default AdminPagination;
