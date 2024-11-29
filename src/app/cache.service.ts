import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const MAX_CACHE_AGE = 300000; // Maximum cache age in milliseconds (5 minutes)

interface CacheEntry {
  url: string;
  response: HttpResponse<any>;
  entryTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  get(req: HttpRequest<any>): HttpResponse<any> | null {
    const cached = this.cache.get(req.urlWithParams);
    if (!cached) {
      return null;
    }

    const isExpired = (Date.now() - cached.entryTime) > MAX_CACHE_AGE;
    if (isExpired) {
      this.cache.delete(req.urlWithParams);
      return null;
    }
    return cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const entry: CacheEntry = { url: req.urlWithParams, response, entryTime: Date.now() };
    this.cache.set(req.urlWithParams, entry);
  }
}
