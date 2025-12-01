import iconMap from "../utils/iconMap";

export function useIcon(iconName) {
  return iconMap[iconName] || null;
}
