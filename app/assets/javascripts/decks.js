//= require angular
// leave it to action-level JS to initialize:
//   deck_array
//   analyze_array

var ng_deck_test = angular.module('ng_app_deck_test', []);

function create_card(card_name, card_quantity, card_type){
  // to-do: return false on invalid card
  if(!card_name){
    alert('Please enter a card name.');
    return false;
  }
  return {
    'name': card_name,
    'quantity': parseInt(card_quantity),
    'type': card_type.toLowerCase()
  };
}

function find_card_index(deck_array, card_name){
  var index = false;
  for (var i = 0; i < deck_array.length; i++) {
    if(deck_array[i].name == card_name){ index = i; break; }
  }
  return index;
}