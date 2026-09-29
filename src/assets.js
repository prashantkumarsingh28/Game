// Centralized Asset Registry
// Easily swap out background images, sound effects, or music tracks here

import { Image } from 'react-native';

export const ASSETS = {
  images: {
    backgroundWallpaper: require('../assets/images/background_wallpaper.png'),
    cityBoardWallpaper: require('../assets/images/city_board_wallpaper.png'),
    luxuryGameWallpaper: require('../assets/images/luxury_game_wallpaper.png'),
    realEstateCityWallpaper: require('../assets/images/real_estate_city_wallpaper.png'),
  },
  sounds: {},
  music: {},
};

export function getAssetSource(asset) {
  if (!asset) return null;
  if (typeof asset === 'number') {
    const resolved = Image.resolveAssetSource(asset);
    return resolved || asset;
  }
  if (typeof asset === 'string') return { uri: asset };
  if (typeof asset === 'object') {
    if (asset.uri) return asset;
    if (asset.default) {
      return typeof asset.default === 'string' ? { uri: asset.default } : asset.default;
    }
  }
  return asset;
}
