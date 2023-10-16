import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ChartData, ChartType } from "chart.js";

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public year: number = new Date().getFullYear();
    public barChartLabels: string[] = [];
    public barChartType: ChartType;
    public barChartLegend: boolean;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];

    // Pie
    // public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    // public pieChartData: number[] = [300, 500, 100];
    public pieChartData: ChartData<'pie', number[], string | string[]> = {
        labels: [ [ 'Download', 'Sales' ], [ 'In', 'Store', 'Sales' ], 'Mail Sales' ],
        datasets: [ {
            data: [ 300, 500, 100 ]
        } ]
    };
    public pieChartType: ChartType;

    constructor() {}

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [Math.round(Math.random() * 100), 59, 80, Math.random() * 100, 56, Math.random() * 100, 40];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

    ngOnInit() {
        this.barChartType = 'bar';
        this.barChartLegend = true;
        this.pieChartType = 'pie';

        for(let i = 6; i >= 0; i--){
            this.barChartLabels.push((this.year - i).toString());
        }
    }
}
