import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from "src/app/core/service/auth.service";
import { SessionService } from "src/app/core/service/session.service";
import { Router } from "@angular/router";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('Login Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let httpCtrl: HttpTestingController;
    let routerMock: {navigate: jest.Mock};
    let sessionMock: {logIn: jest.Mock};
    let debugElement: DebugElement;

    beforeEach(async () => {
        routerMock = {navigate: jest.fn()};
        sessionMock = {logIn: jest.fn()};
        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: SessionService, useValue: sessionMock},
                {provide: Router, useValue: routerMock}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        httpCtrl = TestBed.inject(HttpTestingController);
        await fixture.whenStable();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should login successfully', () => {
        component.submit();
        const req = httpCtrl.expectOne('/api/auth/login');
        const mockSessionInfo = { token: 'token', id: 1, username: 'user', firstName: 'Test', lastName: 'Test', admin: false };
        req.flush(mockSessionInfo);
        expect(sessionMock.logIn).toHaveBeenCalledWith(mockSessionInfo);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should handle login error and show error message', () => {
        component.submit();
        const req = httpCtrl.expectOne('/api/auth/login');
        req.flush({message: 'Erreur de connexion'}, {status: 401, statusText: 'Unauthorized'});
        expect(component.onError).toBeTruthy();
        fixture.detectChanges();
        const errorMessage = debugElement.query(By.css('[data-testid="error-message"]'));
        expect(errorMessage).toBeTruthy();
    });

    it('should disable the submit button if form is invalid', () => {
        component.form.get('email')?.setValue('invalid-email');
        component.form.get('password')?.setValue('12');
        fixture.detectChanges();
        const submitButton = debugElement.query(By.css('[data-testid="submit-button"]')).nativeElement;
        expect(submitButton.disabled).toBeTruthy();
    });

    afterEach(() => {
        httpCtrl.verify();
    });

});