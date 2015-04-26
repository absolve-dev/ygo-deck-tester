// assumes deck_array is global
//= require jquery-ui/sortable

// edit function start

function deck_interface_edit(add_selector, list_selector){
  
  // create add card structure
  var add_form = document.createElement('form');
  $(add_form).addClass('add_card');
  
  // take no action on add card submission
  add_form.action = 'javascript:void(0);';
 
  // add name input
  var name_input = document.createElement('input');
  name_input.id = 'card_name';
  name_input.placeholder = 'Card Name';
  $(add_form).append(name_input);
  
  // add quantity input
  var quantity_select = document.createElement('select');
  quantity_select.id = 'card_quantity';
  // add quantity options
  for(var i = 1; i < 4; i++){
    var option = document.createElement('option');
    option.value = i;
    $(option).html(i);
    $(quantity_select).append(option);
  }
  $(add_form).append(quantity_select);
  
  // add type input 
  var type_select = document.createElement('select');
  type_select.id = 'card_type';
  // add type options
  // declare types in following array
  var types_array = ['Monster', 'Spell', 'Trap'];
  for(var i = 0; i < types_array.length; i++){
    var option = document.createElement('option');
    option.value = types_array[i];
    $(option).html(types_array[i]);
    $(type_select).append(option);
  }
  $(add_form).append(type_select);
 
  // hidden element to indicate list selector
  var hidden_list_selector = document.createElement('input');
  hidden_list_selector.type = 'hidden';
  hidden_list_selector.value = list_selector;
  $(add_form).append(hidden_list_selector);
  
  // add submit button
  var submit_button = document.createElement('input');
  submit_button.type = 'submit';
  $(add_form).append(submit_button);
  
  // add submit hook
  $(add_form).on('submit', function(){
    var new_card_name = name_input.value;
    var new_card_qty = quantity_select.value;
    var new_card_qty_int = parseInt(new_card_qty);
    var new_card_type = type_select.value;
    var card = {
      name: new_card_name,
      quantity: new_card_qty_int,
      type: new_card_type
    };
    add_card_to_deck(card, list_selector);
  });
  
  // place form in add div
  $(add_selector).html(add_form);
  
  // create card list
  // set card list to mutable, true
  refresh_deck_list(list_selector, true);
  
}

// edit helper functions


// show function start

function deck_interface_show(list_selector){
  refresh_deck_list(list_selector, false);
}

function deck_interface_analyze(list_selector, find_selector){
  
}


// helper functions


// mutable is true or false, passed by the calling function, determines whether edit functions are enabled
function refresh_deck_list(list_selector, mutable){
    
  // create deck list ul
  var deck_ul = document.createElement('ul');
  $(deck_ul).addClass('deck_list');
  
  // add cards
  Object.keys(deck_array).forEach(function(key){
    // create card li
    var card_li = document.createElement('li');
    $(card_li).addClass('deck_list_card');
    
    // add card li contents
    // create h3 for card quantity
    var h3 = document.createElement('h3');
    $(h3).addClass('card_quantity');
    $(h3).html(deck_array[key].quantity);
    
    $(card_li).html(deck_array[key].name);
    $(card_li).prepend(h3);
    
    // add card ID
    $(card_li).attr('card_id', key);
    
    // add card type to style
    // must make card type lowercase
    card_type = (deck_array[key].type).toLowerCase();
    $(card_li).addClass(card_type);
    
    // add logic for no immutable
    if(mutable){
      // quantity buttons div
      var quantity_div = document.createElement('div');
      $(quantity_div).addClass('quantity_buttons');
      
      // remove quantity button
      var remove_quantity_button = document.createElement('button');
      $(remove_quantity_button).addClass('remove_quantity');
      $(remove_quantity_button).addClass('quantity_button');
      $(remove_quantity_button).html('-');
      
      // add card ID
      $(remove_quantity_button).attr('card_id', key);

      // if quantity is one, remove the card altogether
      if(deck_array[key].quantity == 1){
        $(remove_quantity_button).on( 'click', function(){
          remove_card_from_deck($(this).attr('card_id'), list_selector);
        });
      }else{
        $(remove_quantity_button).on( 'click', function(){
          remove_card_quantity($(this).attr('card_id'), list_selector);
        });
      }
      $(quantity_div).append(remove_quantity_button);
      
      // add quantity button
      var add_quantity_button = document.createElement('button');
      $(add_quantity_button).addClass('add_quantity');
      $(add_quantity_button).addClass('quantity_button');
      $(add_quantity_button).html('+');
      
      // add card ID
      $(add_quantity_button).attr('card_id', key);

      // do not allow add if quantity is max (3)
      if(deck_array[key].quantity == 3){
        add_quantity_button.disabled = true;
      }else{
        $(add_quantity_button).on( 'click', function(){
          add_card_quantity($(this).attr('card_id'), list_selector);
        });
      }
      $(quantity_div).append(add_quantity_button);
            
      $(card_li).prepend(quantity_div);
      
      // add card removal button and hook
      var remove_button = create_remove_button(key);
      $(remove_button).on( 'click', function(){
        remove_card_from_deck($(this).attr('card_id'), list_selector);
      });
      $(card_li).append(remove_button);
      
      $(deck_ul).sortable();
    }
    $(deck_ul).append(card_li);
  });  
  
  $(list_selector).html( deck_ul );
  
}

function add_card_to_deck(card, list_selector){
  // add card to deck_array
  deck_array.push(card);
  
  // refresh deck after add
  refresh_deck_list(list_selector, true);
}

// add a copy of a card
function add_card_quantity(card_id, list_selector){
  deck_array[card_id].quantity += 1;
  refresh_deck_list(list_selector, true);
}

// remove a copy of a card
function remove_card_quantity(card_id, list_selector){
  deck_array[card_id].quantity -= 1;
  refresh_deck_list(list_selector, true);
}

// creates a remove button
// trigger is set by calling function
function create_remove_button(card_id){
  // create button element
  var remove_element = document.createElement('div');
  $(remove_element).addClass('remove_card');
  
  // add button contents
  $(remove_element).html('Remove');
  
  // add card ID
  $(remove_element).attr('card_id', card_id);
  
  return remove_element;
}

// list selector passed by refresh_deck_list
function remove_card_from_deck(remove_id, list_selector){
  // remove from deck_array
  deck_array.splice(remove_id, 1);
  
  // refresh after removal
  refresh_deck_list(list_selector, true);
}