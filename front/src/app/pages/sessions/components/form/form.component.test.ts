import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormComponent } from "./form.component";
import { SessionService } from "src/app/core/service/session.service";
import { SessionApiService } from "src/app/core/service/session-api.service";
import { ActivatedRoute, Router } from "@angular/router";

describe('Form Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<FormComponent>;
    let component: FormComponent;
    let httpCtrl: HttpTestingController;
    let mockRouter: any;
    let mockActivatedRoute: any;
    let sessionMock: {
        sessionInformation: { admin: true, id: number },
        logIn: jest.Mock
    };

    const mockYogaSession = { name: 'Session 1', date: '2026-04-01', description: "description", teacher_id: 1 };
    const mockYogaTeacher = { id: 1, lastName: "Teacher", firstName: "First", createdAt: '2026-04-01', updatedAt: '2026-04-01' }

    beforeEach(async () => {
        mockRouter = {
            url: '/sessions/create',
            navigate: jest.fn()
        };
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: jest.fn().mockReturnValue(null) 
                }
            }
        };
        sessionMock = { sessionInformation: { admin: true, id: 1 }, logIn: jest.fn() };
        await TestBed.configureTestingModule({
            imports: [FormComponent],
            providers: [
                SessionApiService,
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: SessionService, useValue: sessionMock },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should create a session when the form is correct', () => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        const teacherReq = httpCtrl.expectOne('api/teacher');
        teacherReq.flush([mockYogaTeacher]);

        component.sessionForm?.patchValue(mockYogaSession);
        component.submit();

        const createReq = httpCtrl.expectOne('api/session');
        expect(createReq.request.body).toEqual(mockYogaSession);
        createReq.flush(mockYogaSession);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should show an error message if the create form is invalid', () => {
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        const teacherReq = httpCtrl.expectOne('api/teacher');
        teacherReq.flush([mockYogaTeacher]);

        expect(component.sessionForm?.valid).toBeFalsy();

        const nameControl = component.sessionForm?.controls['name'];
        nameControl?.markAsTouched();
        fixture.detectChanges();

        const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
        expect(saveButton.disabled).toBeTruthy();
    });

    it('should update a session when the form is correct', () => {
        mockRouter.url = 'api/sessions/update/1';
        mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);

        expect(component.sessionForm?.value.name).toEqual(mockYogaSession.name);
        component.sessionForm?.patchValue({name : mockYogaSession.name + " updated"});
        component.submit();

        const updateReq = httpCtrl.expectOne('api/session/1');
        expect(updateReq.request.body.name).toEqual(mockYogaSession.name + " updated");
        updateReq.flush(mockYogaSession);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });

    it('should show an error message if the update form is invalid', () => {
        mockRouter.url = 'api/sessions/update/1';
        mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();

        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);

        expect(component.sessionForm?.valid).toBeTruthy();

        const nameControl = component.sessionForm?.controls['name'];
        nameControl?.setValue("");
        nameControl?.markAsTouched();
        fixture.detectChanges();

        const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
        expect(saveButton.disabled).toBeTruthy();

        const teacherReq = httpCtrl.expectOne('api/teacher');
        teacherReq.flush([mockYogaTeacher]);
    });

    afterEach(() => {
        httpCtrl.verify();
    });

});
