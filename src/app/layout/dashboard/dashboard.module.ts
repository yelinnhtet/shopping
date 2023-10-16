import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbAlertModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { StatModule } from '../../shared';
import { ChatComponent, NotificationComponent, TimelineComponent } from './components';
import { NgChartsModule  as Ng2Charts } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboradService } from '../../core/services/dashborad.service';
import { ChartsComponent } from '../charts/charts.component';
import { PageHeaderModule } from '../../shared';

@NgModule({
    imports: [CommonModule, NgbCarouselModule, NgbAlertModule, DashboardRoutingModule, StatModule, Ng2Charts, PageHeaderModule],
    declarations: [DashboardComponent, TimelineComponent, NotificationComponent, ChatComponent, ChartsComponent],
    providers: [DashboradService]
})
export class DashboardModule {}
