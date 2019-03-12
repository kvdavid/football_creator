import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

@Injectable()
export class AjaxService {

    public urls_prefix;
    constructor(private _http: Http, private router: Router) {
    }

    public ajxCall(url, data) {
        if (window.location.hostname.toLowerCase() == "localhost") {
            this.urls_prefix = "http://localhost/football/ajax/";
        } else {
            this.urls_prefix = "ajax/";
        }
        var tmpUrl = this.urls_prefix + url;
        return this._http.post(tmpUrl, data);
    }
}
