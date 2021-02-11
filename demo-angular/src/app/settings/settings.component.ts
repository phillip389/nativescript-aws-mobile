import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, EventData, Switch } from "@nativescript/core";
import { AwsMobile } from "@nspluginadd/nativescript-aws-mobile";


@Component({
    selector: "Settings",
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {




    passwordConfirm: string = "";
    private activationCode: string = "";
    private _cognito;

    isEmailorPhoneNumber = true;

    user;
    private _isRegistering: boolean;
    private _isSignedIn: boolean;

    constructor() {
        this._isRegistering = false;
        this.initUser();
    }

    ngOnInit(): void {
        this._cognito = AwsMobile.cognito;
    }

    toggleRegistering() {
        this.isRegistering = !this.isRegistering;
    }

    onCheckedChange(args: EventData) {
        let sw = args.object as Switch;
        this.isEmailorPhoneNumber = sw.checked; // boolean
    }

    get cognito() {
        return this._cognito;
    }

    get isRegistering(): boolean {
        return this._isRegistering;
    }

    set isRegistering(isRegistering: boolean) {
        this._isRegistering = isRegistering;
    }

    get isSignedIn(): boolean {
        const s = AwsMobile.cognito.isLoggedIn;
        return s;
    }

    private initUser() {
        this.user = {
            username: "",
            email: "",
            password: "",
            attributes: {
                email: "",
                nickname: "",
                phone_number: "",
            },
        };
    }

    async login() {
        try {
            let data = await this.cognito.authenticate(this.user.username, this.user.password);
            let details = await this.cognito.getUserDetails();
            this._isSignedIn = true;
        } catch (e) {
            console.log("login Error: {}", e);
        }
    }

    async confirmRegistration() {
        try {
            console.log(
                "this.user.username: {} this.activationCode: {}",
                this.user.username,
                this.activationCode
            );
            let data = await this.cognito.confirmRegistration(
                this.user.username,
                this.activationCode
            );
            console.log("confirmRegistration", data);
        } catch (e) {
            console.log("confirmRegistration Error: {}", e);
        }
    }

    async resendCode(username?: string) {
        try {
            const u = !!username ? username : this.user.username;
            let data = await this.cognito.resendCode(u);
            console.log(data);
        } catch (e) {
            console.log("resendCode Error: {}", e);
        }
    }

    async register() {
        console.log("is this register working", this.user);

        try {
            let data = await this.cognito.signUpUser(this.user);
            console.log(data);
        } catch (e) {
            console.log("register Error: {}", e);
        }
    }

    async forgot() {
        try {
            let data = await this.cognito.forgotPassword(this.user.username);
            console.log(data);
        } catch (e) {
            console.log("forgot Error: {}", e);
        }
    }

    async confirmForgot() {
        try {
            let data = await this.cognito.confirmForgotPassword(
                this.user.username,
                this.activationCode,
                this.user.password
            );
            console.log(data);
        } catch (e) {
            console.log("confirmForgot Error: {}", e);
        }
    }

    async refreshSession() {
        try {
            let data = await this.cognito.getCurrentUserSession();
            console.log(data);
        } catch (e) {
            console.log("refreshSession Error: {}", e);
        }
    }

    async getUserDetails() {
        try {
            let data = await this.cognito.getUserDetails();
            console.log(data);
        } catch (e) {
            console.log("getUserDetails Error: {}", e);
        }
    }

    logout() {
        try {
            this.cognito.logout();
            this._isSignedIn = false;
        } catch (e) {
            console.log("logout Error: {}", e);
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
