import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MeComponent } from "./me.component";
import { SessionService } from "src/app/core/service/session.service";
import { SessionApiService } from "src/app/core/service/session-api.service";
import { ActivatedRoute, Router } from "@angular/router";

describe('Me Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<MeComponent>;
    let component: MeComponent;
    let httpCtrl: HttpTestingController;
    let routerMock: { navigate: jest.Mock };
    let sessionMock: {
        sessionInformation: { admin: false, id: number },
        logIn: jest.Mock,
        logOut: jest.Mock
    };
    const mockUser = { id: 1, email: "email@test.com", lastName: "User", firstName: "Test", admin: false, password: "password", createdAt: '2026-04-01', updatedAt: '2026-04-01' };

    beforeEach(async () => {
        routerMock = { navigate: jest.fn() };
        sessionMock = {
            sessionInformation: { admin: false, id: 1 }, 
            logIn: jest.fn(),
            logOut: jest.fn()
        };
        await TestBed.configureTestingModule({
            imports: [MeComponent],
            providers: [
                SessionApiService,
                { provide: Router, useValue: routerMock },
                { provide: SessionService, useValue: sessionMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => '1'
                            }
                        }
                    }
                },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should show the correct user informations', () => {
        fixture.detectChanges();
        const userDetailReq = httpCtrl.expectOne("api/user/1");
        userDetailReq.flush(mockUser);
        fixture.detectChanges();

        const userName = fixture.nativeElement.querySelector('[data-testid="user-name"]');
        expect(userName.textContent).toContain(mockUser.lastName.toUpperCase());
        expect(userName.textContent).toContain(mockUser.firstName);
        const userEmail = fixture.nativeElement.querySelector('[data-testid="user-email"]');
        expect(userEmail.textContent).toContain(mockUser.email);
    });

    it('should correctly delete the user', () => {
        component.delete();
        const deleteReq = httpCtrl.expectOne('api/user/1');
        deleteReq.flush(sessionMock);
        expect(sessionMock.logOut).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });

    afterEach(() => {
        httpCtrl.verify();
    });

});
