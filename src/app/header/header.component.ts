import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    private userSub: Subscription;
    isAuthenticated = false;
    constructor(private dSS: DataStorageService, private authService: AuthService){}

    ngOnInit(){
        this.userSub = this.authService.user.subscribe(
            user => {
                this.isAuthenticated = !!user;
            }
        );
    }
    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    onSaveData(){
        this.dSS.storeRecipes();
    }

    onFetchData(){
        this.dSS.fetchRecipes().subscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}
