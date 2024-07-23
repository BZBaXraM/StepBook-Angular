import {HomeComponent} from './home/home.component';
import {MemberListComponent} from './members/member-list/member-list.component';
import {MemberDetailComponent} from './members/member-detail/member-detail.component';
import {ListsComponent} from './lists/lists.component';
import {MessagesComponent} from './messages/messages.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {ConfirmationEmailSentComponent} from "./confirmation-email-sent/confirmation-email-sent.component";
import {Routes} from "@angular/router";
import {authGuard} from "./guards/auth.guard";

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
	},
	{
		path: '',
		runGuardsAndResolvers: 'always',
		canActivate: [authGuard],
		children: [
			{
				path: 'members',
				component: MemberListComponent,
			},
			{
				path: 'members/:id',
				component: MemberDetailComponent,
			},
			{
				path: 'lists',
				component: ListsComponent,
			},
			{
				path: 'messages',
				component: MessagesComponent,
			},
		]
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	// {
	// 	path: 'confirmation-email-sent',
	// 	component: ConfirmationEmailSentComponent
	// },
	// {
	// 	path: 'confirm-email',
	// 	component: ConfirmEmailComponent
	// },
	{
		path: 'login',
		component: LoginComponent,
	},

	{
		path: '**',
		component: HomeComponent,
		pathMatch: 'full',
	},
];
