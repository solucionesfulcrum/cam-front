import { Injectable } from "@angular/core";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class StorageClientService {
  private STORAGE_NAME_EVENT = "storage";

  constructor() {}

  public get storage(): Storage {
    return localStorage;
  }

  public get storage$() {
    return fromEvent<StorageEvent>(window, this.STORAGE_NAME_EVENT).pipe(
      filter((event) => event && event.storageArea === this.storage)
    );
  }

  public cleanStorage() {
    const { storage } = this;
    return storage.clear();
  }

  public getStorageItem(key: string) {
    const { storage } = this;
    return storage.getItem(key);
  }

  public setStorageItem(key: string, value: string) {
    const { storage } = this;
    return storage.setItem(key, value);
  }

  public removeStorageItem(key: string) {
    const { storage } = this;
    return storage.removeItem(key);
  }
}
