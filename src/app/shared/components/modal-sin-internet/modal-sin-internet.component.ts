import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { CacheImageService } from '@shared/utils/no-internet-cache-img';

@Component({
  selector: 'app-no-internet-dialog',
  templateUrl: './modal-sin-internet.component.html',
})
export class ModalSinInternetComponent implements OnInit  {

  faClose = faClose
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private _dialogRef                    : DialogRef<any>,
  private imageCache : CacheImageService
) {}

  onClose(){
    this._dialogRef.close();
    }

    async ngOnInit(): Promise<void> {
      const cachedUrl = await this.imageCache.getCachedImage("assets/svg/wifi-slash-svgrepo-com.svg");
        if (cachedUrl) {
          //this.imageUrls.push(cachedUrl);
        }
    }
}
