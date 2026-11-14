import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularytrainerPage } from './vocabularytrainer-page';

describe('VocabularytrainerPage', () => {
  let component: VocabularytrainerPage;
  let fixture: ComponentFixture<VocabularytrainerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularytrainerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VocabularytrainerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
