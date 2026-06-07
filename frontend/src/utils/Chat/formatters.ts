export function formatTime(iso: string): string {
    try {
        return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

export function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    } catch {
        return "";
    }
}
