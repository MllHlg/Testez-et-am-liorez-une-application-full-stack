import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotFoundComponent } from "./not-found.component";

describe('NotFound Page - [INTEGRATION]', () => {
    let fixture: ComponentFixture<NotFoundComponent>;
    let component: NotFoundComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NotFoundComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});
