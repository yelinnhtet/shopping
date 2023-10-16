import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboradService {

  constructor(private apiService: ApiService) { }

  getNumberOfUser(){
    return this.apiService.get('user');
  }

  getNumberOfShop(){
    return this.apiService.get('shop');
  }

  getNumberOfOrder(){
    return this.apiService.get('getOrder');
  }

  getNumberOfOrderByMonth(month){
    return this.apiService.postJson('orderByMonth', {'month': month});
  }
}
