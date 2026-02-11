
export const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};



export const getTurkishLira = (price: number) => {
    return price.toLocaleString('tr-TR', {
        style: "currency",
        currency: "TRY",
    });
}


