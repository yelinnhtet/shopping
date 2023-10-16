import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { DashboradService } from '../../core/services/dashborad.service';
import { ThemeService } from 'ng2-charts';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    public month: any = 'Order in '+this.monthNames[new Date().getMonth()];
    orders: any;
    users: any;
    shops: any;
    current_month_order: any;

    constructor(private dashboardService: DashboradService) { }

    ngOnInit() {
        this.dashboardService.getNumberOfUser().subscribe(x=>this.users = x.data);
        this.dashboardService.getNumberOfOrder().subscribe(x=>this.orders = x.data);
        this.dashboardService.getNumberOfOrderByMonth(this.month).subscribe(x => this.current_month_order = x.data);
        this.dashboardService.getNumberOfShop().subscribe(x => this.shops = x.data);
     }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
