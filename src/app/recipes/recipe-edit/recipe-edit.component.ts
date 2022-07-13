import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number
  editMode = false
  recipeForm: FormGroup
  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']
          this.editMode = params['id'] != null;
          this.initForm() //we call it bc rote changes means that our page is reloaded
        }
      )
  }
  private initForm() {
    let recipeName =  '';
    let recipeImgPath='';
    let recipeDescription='';
    let recipeIngredients = new FormArray([])
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id)
      recipeName= recipe.name
      recipeImgPath=recipe.imagePath
      recipeDescription=recipe.description
      if(recipe['ingredients']) {
        for (let ingredient  of  recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount,
               [ Validators.required,
                 Validators.pattern(/^[1-9]+[0-9]*$/)]
                 )
            })
          )
        }
      }
    }
    this.recipeForm = new FormGroup({
        'name': new FormControl(recipeName, Validators.required),      
        'imagePath': new FormControl(recipeImgPath, Validators.required),       
        'description': new FormControl(recipeDescription, Validators.required),
        'ingredients': recipeIngredients
    });
  }
  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),     
        'amount': new FormControl(null, [ Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)]
         )   
       })
    )
  }
  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route})
  }
  onSubmit(){
    // const newrecipe = new Recipe(this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.ingredients )
    this.editMode ? 
    this.recipeService.updateRecipe(this.id, this.recipeForm.value) 
    : this.recipeService.addRecipe(this.recipeForm.value)
    this.onCancel()
  }
  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
 
}
