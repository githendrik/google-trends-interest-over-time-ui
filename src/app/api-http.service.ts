import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ApiHttpService {
    constructor(private httpClient: HttpClient) {}

    getDummy() {
        return this.httpClient.get('/api/dummy');
    }

    getInterestOverTime(keyword: string, startDate: string, endDate: string) {
        return this.httpClient.post('/api/getInterestOverTime', { startDate, endDate, keyword });
    }
}
