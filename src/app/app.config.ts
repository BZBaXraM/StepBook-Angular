import {
	ApplicationConfig,
	importProvidersFrom,
	provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { TimeagoModule } from 'ngx-timeago';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/errors.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideAnimations(),
		provideToastr({
			positionClass: 'toast-bottom-right',
		}),
		provideHttpClient(
			withInterceptors([
				errorInterceptor,
				jwtInterceptor,
				loadingInterceptor,
			])
		),
		provideAnimationsAsync(),
		importProvidersFrom(NgxSpinnerModule, TimeagoModule.forRoot()),
	],
};
