import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheImageService {

    private cacheName = 'app-cache';

    constructor() {
      this.cacheImages([
        'assets/svg/wifi-slash-svgrepo-com.svg',
      ]);
    }
  
    async cacheImages(urls: string[]): Promise<void> {
      if ('caches' in window) {
        try {
          const cache = await caches.open(this.cacheName);
          await cache.addAll(urls);
          //console.log(`Images cached: ${urls.join(', ')}`);
        } catch (error) {
          //console.error(`Failed to cache images: ${urls.join(', ')}`, error);
        }
      }
    }
  
    async getCachedImage(url: string): Promise<string | null> {
      if ('caches' in window) {
        try {
          const cache = await caches.open(this.cacheName);
          const response = await cache.match(url);
          if (response) {
            return URL.createObjectURL(await response.blob());
          }
        } catch (error) {
          //console.error(`Failed to retrieve cached image: ${url}`, error);
        }
      }
      return null;
    }
}
