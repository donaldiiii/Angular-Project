import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  sub: Subscription;
  constructor(private router: ActivatedRoute,
              private route: Router,
              private recipeService: RecipeService,
              private dss: DataStorageService) { }

  ngOnInit(): void {
    this.dss.fetchRecipes();
    this.sub = this.recipeService.recipeChanged
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipes = recipes;
        }
      );
    this.recipes = this.recipeService.getRecipes();
  }
  onNewRecipe() {
    this.route.navigate(['new'], { relativeTo: this.router });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
