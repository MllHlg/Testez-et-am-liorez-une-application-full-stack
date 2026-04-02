import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DetailComponent } from "./detail.component";
import { SessionService } from "src/app/core/service/session.service";
import { SessionApiService } from "src/app/core/service/session-api.service";
import { ActivatedRoute } from "@angular/router";
import { TitleCasePipe } from "@angular/common";

describe('Detail Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<DetailComponent>;
    let component: DetailComponent;
    let httpCtrl: HttpTestingController;
    let sessionMock: {
        sessionInformation: { admin: false, id: number },
        logIn: jest.Mock
    };
    const mockYogaSession = { id: 1, name: 'Session 1', date: '2026-04-01', description: "description", duration: 60, teacher_id: 1, users: [] };
    const mockYogaTeacher = { id: 1, lastName: "Teacher", firstName: "First", createdAt: '2026-04-01', updatedAt: '2026-04-01' }

    beforeEach(async () => {
        sessionMock = { sessionInformation: { admin: false, id: 1 }, logIn: jest.fn() };
        await TestBed.configureTestingModule({
            imports: [DetailComponent],
            providers: [
                SessionApiService,
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

        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;
        httpCtrl = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should show correct session informations', () => {
        fixture.detectChanges();
        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);
        const teacherDetailReq = httpCtrl.expectOne('api/teacher/1');
        teacherDetailReq.flush(mockYogaTeacher);
        fixture.detectChanges();

        const sessionName = fixture.nativeElement.querySelector('[data-testid="session-name"]');
        const titleCasePipe = new TitleCasePipe();
        expect(sessionName.textContent).toContain(titleCasePipe.transform(mockYogaSession.name));

        const sessionDescription = fixture.nativeElement.querySelector('[data-testid="session-description"]');
        expect(sessionDescription.textContent).toContain(mockYogaSession.description);

        const sessionUsersLength = fixture.nativeElement.querySelector('[data-testid="session-users-length"]');
        expect(sessionUsersLength.textContent).toContain(mockYogaSession.users.length.toString());

        const sessionTeacherName = fixture.nativeElement.querySelector('[data-testid="teacher-name"]');
        expect(sessionTeacherName.textContent).toContain(mockYogaTeacher.firstName);
        expect(sessionTeacherName.textContent).toContain(mockYogaTeacher.lastName.toUpperCase());
    });

    it('should show delete button if user is admin', () => {
        component.isAdmin = true;
        fixture.detectChanges();
        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);
        const teacherDetailReq = httpCtrl.expectOne('api/teacher/1');
        teacherDetailReq.flush(mockYogaTeacher);
        fixture.detectChanges();
        const deleteButton = fixture.nativeElement.querySelector('[data-testid="delete-button"]');
        expect(deleteButton).toBeTruthy();
    });

    it('should delete the session when the button delete is used', () => {
        component.isAdmin = true;
        fixture.detectChanges();
        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);
        const teacherDetailReq = httpCtrl.expectOne('api/teacher/1');
        teacherDetailReq.flush(mockYogaTeacher);
        fixture.detectChanges();

        const deleteButton = fixture.nativeElement.querySelector('[data-testid="delete-button"]');
        deleteButton.click();
        const deleteReq = httpCtrl.expectOne('api/session/1');
        expect(deleteReq.request.method).toBe('DELETE');
        deleteReq.flush({});
    });

    it("should add user to the participant list if he's not already in", () => {
        component.participate();

        const participateReq = httpCtrl.expectOne('api/session/1/participate/1');
        participateReq.flush({});

        const updatedMockSession = { ...mockYogaSession, users: [1] };
        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(updatedMockSession);

        const teacherDetailReq = httpCtrl.expectOne('api/teacher/1');
        teacherDetailReq.flush(mockYogaTeacher);

        expect(component.isParticipate).toBe(true);
        expect(component.session?.users).toContain(sessionMock.sessionInformation.id);
    });

    it("should remove user to the participant list if he's already in", () => {
        component.unParticipate();

        const participateReq = httpCtrl.expectOne('api/session/1/participate/1');
        participateReq.flush({});

        const sessionDetailReq = httpCtrl.expectOne('api/session/1');
        sessionDetailReq.flush(mockYogaSession);

        const teacherDetailReq = httpCtrl.expectOne('api/teacher/1');
        teacherDetailReq.flush(mockYogaTeacher);

        expect(component.isParticipate).toBe(false);
        expect(component.session?.users).not.toContain(sessionMock.sessionInformation.id);
    });

    afterEach(() => {
        httpCtrl.verify();
    });

});
