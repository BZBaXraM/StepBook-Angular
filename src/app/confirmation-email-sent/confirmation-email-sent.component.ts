import { Component, inject, OnInit } from "@angular/core";
import { AccountService } from "../services/account.service";

@Component({
    selector: "app-confirmation-email-sent",
    standalone: true,
    imports: [],
    templateUrl: "./confirmation-email-sent.component.html",
    styleUrl: "./confirmation-email-sent.component.css",
})
export class ConfirmationEmailSentComponent implements OnInit {
    private service = inject(AccountService);
    constructor() {}
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
}
