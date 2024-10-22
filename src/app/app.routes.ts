import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangeGuard } from './guards/prevent-unsaved-change.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfirmationEmailSentComponent } from './confirmation-email-sent/confirmation-email-sent.component';
import { MessagesComponent } from './messages/messages.component';
import { memberDetailedResolver } from './member-detailed.resolver';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AdminComponent } from './admin/admin.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { SearchMemberComponent } from './members/search-member/search-member.component';

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
				path: 'members/:username',
				component: MemberDetailComponent,
				resolve: { member: memberDetailedResolver },
			},
			{
				path: 'member/:edit',
				component: MemberEditComponent,
				canDeactivate: [preventUnsavedChangeGuard],
			},
			{
				path: 'lists',
				component: ListsComponent,
			},
			{
				path: 'messages',
				component: MessagesComponent,
			},
			{
				path: 'search',
				component: SearchMemberComponent,
			},
			{ path: 'account-settings', component: AccountSettingsComponent },
		],
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'confirmation-email-sent',
		component: ConfirmationEmailSentComponent,
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'confirm-email',
		component: ConfirmEmailComponent,
	},
	{ path: 'forget-password', component: ForgetPasswordComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'errors', component: TestErrorsComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: 'server-error', component: ServerErrorComponent },
	{ path: 'admin', component: AdminComponent },
	{
		path: '**',
		component: HomeComponent,
		pathMatch: 'full',
	},
];
