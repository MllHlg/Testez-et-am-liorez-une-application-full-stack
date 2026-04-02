import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from "src/app/core/service/auth.service";
import { Router } from "@angular/router";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RegisterComponent } from "./register.component";

describe('Register Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let component: RegisterComponent;
    let httpCtrl: HttpTestingController;
    let routerMock: {navigate: jest.Mock};
    let debugElement: DebugElement;

    beforeEach(async () => {
        routerMock = {navigate: jest.fn()};
        TestBed.configureTestingModule({
            imports: [RegisterComponent],
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting(),
                {provide: Router, useValue: routerMock}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        httpCtrl = TestBed.inject(HttpTestingController);
        await fixture.whenStable();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should register successfully', () => {
        component.submit();
        const registerReq = httpCtrl.expectOne('/api/auth/register');
        registerReq.flush(null);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle register error and show error message', () => {
        component.submit();
        const req = httpCtrl.expectOne('/api/auth/register');
        req.flush({message: 'Error: Email is already taken!'}, {status: 400, statusText: 'Bad Request'});
        expect(component.onError).toBeTruthy();
        fixture.detectChanges();
        const errorMessage = debugElement.query(By.css('[data-testid="error-message"]'));
        expect(errorMessage).toBeTruthy();
    });
    
    it('should disable the submit button if form is invalid', () => {
        component.form.get('firstName')?.setValue('');
        component.form.get('lastName')?.setValue('');
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