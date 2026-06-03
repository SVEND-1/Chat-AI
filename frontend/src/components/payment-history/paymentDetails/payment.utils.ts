export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
};

export const getStatusText = (status: string): string => {
    switch (status) {
        case 'succeeded':
            return 'Успешно';
        case 'pending':
            return 'В обработке';
        case 'failed':
            return 'Ошибка';
        default:
            return status;
    }
};