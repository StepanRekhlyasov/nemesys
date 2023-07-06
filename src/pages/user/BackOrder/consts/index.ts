import { defineStore } from 'pinia';

export const useBO = defineStore('BO', () => {
  function getDistance(loc1, loc2){
    const R = 6371000;
    const dLat = degToRad(loc2.lat - loc1.lat);
    const dLon = degToRad(loc2.lon - loc1.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(loc1.lat)) *
        Math.cos(degToRad(loc2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Number(distance.toFixed(2));
  };

  const degToRad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  return {getDistance}
})
