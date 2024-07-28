import {inject, Injectable} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";

@Injectable({
	providedIn: 'root'
})
export class BusyService {
	count = 0;
	private readonly service = inject(NgxSpinnerService);

	busy() {
		this.count++;
		this.service.show(undefined, {
			type: 'ball-clip-rotate',
			bdColor: 'rgba(255,255,255,0)',
			color: '#333333'
		}).then(r => r);
	}

	idle() {
		this.count--;
		if (this.count <= 0) {
			this.count = 0;
			this.service.hide().then(r => r);
		}
	}
}
