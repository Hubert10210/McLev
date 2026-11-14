import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { PrivacyPage } from './pages/privacy-page/privacy-page';
import { TermsAndConditionsPage } from './pages/terms-and-conditions-page/terms-and-conditions-page';
import { ImprintPage } from './pages/imprint-page/imprint-page';
import { VocabularytrainerPage } from './pages/vocabularytrainer-page/vocabularytrainer-page'

export const routes: Routes = [
    { path: '', component: HomePage},
    { path: 'login', component: LoginPage},
    { path: 'privacy', component: PrivacyPage},
    { path: 'terms-and-conditions', component: TermsAndConditionsPage},
    { path: 'imprint', component: ImprintPage },
    { path: 'vocabularytrainer', component: VocabularytrainerPage}
];
