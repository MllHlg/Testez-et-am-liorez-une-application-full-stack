import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from "@angular/common/http";
import { SessionService } from './core/service/session.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';


describe('AppComponent - [INTEGRATION]', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let httpCtrl: HttpTestingController;
    let routerMock: { navigate: jest.Mock };
    let sessionMock: {
        $isLogged: jest.Mock,
        logOut: jest.Mock
    };
    beforeEach(async () => {
        routerMock = { navigate: jest.fn() };
        sessionMock = {
            $isLogged: jest.fn().mockReturnValue(of(true)),
            logOut: jest.fn()
        };
        await TestBed.configureTestingModule({
            imports: [
                MatToolbarModule,
                AppComponent
            ],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: SessionService, useValue: sessionMock },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should correctly delete the user', () => {
        component.logout();
        expect(sessionMock.logOut).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['']);
    });

    it('should return the observable from sessionService.$isLogged()', (done) => {
        const $isLogged = component.$isLogged();
        expect(sessionMock.$isLogged).toHaveBeenCalled();
        $isLogged.subscribe(isLogged => {
            expect(isLogged).toBe(true);
            done();
        });
    });
});