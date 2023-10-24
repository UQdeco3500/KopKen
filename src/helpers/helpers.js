
export function convertToCamelCase(inputString) {
    return inputString
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
}

export function getContrastColor(hexColor) {
    // Convert hex color to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Choose white or black text color based on luminance
    return luminance > 0.5 ? 'black' : 'white';
}

export function formatDate(timestamp) {
    const date = new Date(timestamp);

    const dateOptions = {
        day: '2-digit',      // Two-digit day (e.g., 01)
        weekday: 'long',     // Full day name (e.g., Monday)
        month: 'long',      // Full month name (e.g., September)
        year: 'numeric',    // Full year (e.g., 2023)
    };

    const timeOptions = {
        hour: '2-digit',    // Two-digit hour (e.g., 08)
        minute: '2-digit',  // Two-digit minute (e.g., 55)
        hour12: true        // Use 12-hour clock format (e.g., am/pm)
    }

    const dateNumOptions = {
        day: '2-digit'
    }

    const compactDateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };


    const dayString = date.toLocaleDateString('en-US', dateOptions);
    const timeString = date.toLocaleTimeString('en-US', timeOptions);
    const dateString = date.toLocaleTimeString('en-US', dateNumOptions);
    const compactDateString = date.toLocaleDateString('en-GB', compactDateOptions);

    return { dayString, timeString, dateString, compactDateString };
}

export function toAssetCase(text) {
    return text.toLowerCase().replace(' ', '_')
}