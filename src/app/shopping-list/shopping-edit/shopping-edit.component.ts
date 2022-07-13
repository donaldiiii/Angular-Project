import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
 @ViewChild('f', {static: false}) slForm: NgForm
  editMode = false;
 editedItemIndex: number
 subscription: Subscription
 editedItem: Ingredient
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing
    .subscribe(
      (index: number)=>{
        this.editedItemIndex = index
        this.editMode = true;
        this.editedItem= this.shoppingListService.getIngredient(index)
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }
  onSubmit(form: NgForm) {
    const value = form.value
    const ingredient = new Ingredient(value.name, value.amount)
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient)
    } else {   
       this.shoppingListService.addIngridient(ingredient)
    }
    this.editMode = false;
    form.reset()
  }
  onClear(){
    this.slForm.reset()
    this.editMode = false
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex)
    this.onClear()
  }
}