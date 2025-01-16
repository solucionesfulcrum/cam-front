import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
//MODELS
import { iUser } from "src/app/interfaces/user.interface";
import { User } from '@models/user.model';
import { StorageClientService } from '@shared/storage/storage-client.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_USER = "user";
  private user: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private _storage : StorageClientService
  ) {
    if (this.currentUser) {
      this.decodeUser = this.currentUser
    }
  }

  set decodeUser(iUser: iUser) {
    this.user = new User(iUser);
    this.userSubject.next(this.user);
    this._storage.setStorageItem(this.STORAGE_USER, JSON.stringify(iUser));
  }
  get currentUser(): iUser | null {
    return (JSON.parse(this._storage.getStorageItem(this.STORAGE_USER) as string) as iUser);
  }
  get currentUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}
