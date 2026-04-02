import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListComponent } from "./list.component";
import { SessionService } from "src/app/core/service/session.service";
import { SessionApiService } from "src/app/core/service/session-api.service";
import { provideRouter } from "@angular/router";

describe('List Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<ListComponent>;
    let component: ListComponent;
    let httpCtrl: HttpTestingController;
    let sessionMock: {
        sessionInformation: { admin: false },
        logIn: jest.Mock
    };

    beforeEach(async () => {
        sessionMock = {sessionInformation: {admin: false}, logIn: jest.fn()};
        await TestBed.configureTestingModule({
            imports: [ListComponent],
            providers: [
                SessionApiService,
                {provide: SessionService, useValue: sessionMock},
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should load all sessions from API', () => {
        const mockSessions = [
            { id: 1, name: 'Session 1', date: '2026-04-01', duration: 60 },
            { id: 2, name: 'Session 2', date: '2026-04-02', duration: 90 }
        ];
        component.sessions$.subscribe(sessions => {
            expect(sessions).toEqual(mockSessions);
        });
        const req = httpCtrl.expectOne('api/session');
        req.flush(mockSessions);
    });

    it('should show add and edit buttons if user is an admin', () => {
        sessionMock.sessionInformation = { admin: true } as any;
        fixture.detectChanges();
        const req = httpCtrl.expectOne('api/session');
        req.flush([{ id: 1, name: 'Session 1', date: '2026-04-01', duration: 60 }]);
        fixture.detectChanges();
        const addButton = fixture.nativeElement.querySelector('[data-testid="add-button"]');
        const editButtons = fixture.nativeElement.querySelectorAll('[data-testid="edit-button"]');
        expect(addButton).toBeTruthy();
        expect(editButtons.length).toBeGreaterThan(0);
    });

    afterEach(() => {
        httpCtrl.verify();
    });

});