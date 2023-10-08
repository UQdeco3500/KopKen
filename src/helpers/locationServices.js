import { predefinedLocations } from "../data/predefinedLocations";

export function isWithinRadius(userLoc, predefinedLoc, radius = 200) {
    const latDiff = userLoc.latitude - predefinedLoc.latitude;
    const lonDiff = userLoc.longitude - predefinedLoc.longitude;
    const latDiffMeters = latDiff * 111111;
    const lonDiffMeters = lonDiff * 111111 * Math.cos((userLoc.latitude + predefinedLoc.latitude) / 2);
    return Math.sqrt(latDiffMeters * latDiffMeters + lonDiffMeters * lonDiffMeters) <= radius;
}


export function assignLocationName(userLoc) {
    for (let loc of predefinedLocations) {
        if (isWithinRadius(userLoc, loc)) {
            return loc.name;
        }
    }
    return '';  // Return an empty string if not within radius of any predefined locations
}
