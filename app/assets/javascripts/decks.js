//= require jquery-ui/sortable
//= require jquery-ui/droppable

// assumes deck_array is global

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

// show function start

function deck_interface_show(list_selector){
  refresh_deck_list(list_selector, false);
}

// analyze function start

// assume analyze_array is global
// [ [a, b, c], [d, e], [f] ]
// arrays within array
// inner arrays have ORs
// outer array contains combo parts

function deck_interface_analyze(list_selector, find_selector){
  refresh_deck_list(list_selector, false);
  refresh_analyze_list(find_selector, list_selector);
  
  $('ul.deck_list').sortable({
    connectWith: find_selector
  });
  
  $(find_selector).droppable({
    greedy:true,
    accept: 'li.deck_list_card',
    hoverClass: 'analyze_hover',
    drop: function(event, ui){
      var card_id = $(ui.draggable).attr('card_id');
      var card_copy = $.extend({key:card_id}, deck_array[card_id]);
      
      analyze_array.push([card_copy]);
      
      // remove card from deck list
      remove_card_from_deck(card_id, list_selector, true);
      
      refresh_analyze_results();
      
      refresh_analyze_list(find_selector, list_selector);
    }
  });
}

// refresh functions

// mutable is true or false, passed by the calling function, determines whether edit functions are enabled
function refresh_deck_list(list_selector, mutable){
    
  // create deck list ul
  var deck_ul = document.createElement('ul');
  $(deck_ul).addClass('deck_list');
  
  // add cards
  Object.keys(deck_array).forEach(function(key){
    // create card li
    var card_li = create_card_li(deck_array[key],key);
    
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
      
    }
    $(deck_ul).append(card_li);
  });  
  $(deck_ul).sortable({
    // add manual sorting    
    start: function(e, ui) {
      // creates a temporary attribute on the element with the old index
      $(this).attr('data-previndex', ui.item.index());
    },
    update: function(e, ui) {
      // gets the new and old index then removes the temporary attribute
      var newIndex = ui.item.index();
      var oldIndex = $(this).attr('data-previndex');
      $(this).removeAttr('data-previndex');
      change_position_in_deck(oldIndex, newIndex);
      refresh_deck_list(list_selector, mutable);
    }    
  });
  $(list_selector).html( deck_ul );  
}

function refresh_analyze_list(analyze_selector, deck_list_selector){
  var h3 = document.createElement('h3');
  $(h3).html('Enter combo pieces here - (AND)');
  $(h3).addClass('analyze_intro');
  
  $(analyze_selector).html('');
  $(analyze_selector).append(h3);
  
  // check for contents
  if(analyze_array.length > 0){
    Object.keys(analyze_array).forEach(function(analyze_key){
      
      //check for validity and contents
      if( Array.isArray(analyze_array[analyze_key]) && analyze_array[analyze_key].length > 0 ){
        // create a new UL for each
        var current_ul = document.createElement('ul');
        $(current_ul).addClass('analyze_or');
        
        // add ul index in relation to analyze_array
        $(current_ul).attr('analyze_key', analyze_key);
        
        // create intro LI
        var intro_li = document.createElement('li');
        $(intro_li).html('Add desired cards in this box (OR)');
        $(intro_li).addClass('analyze_intro');
        // add intro LI
        $(current_ul).append(intro_li);
        
        Object.keys(analyze_array[analyze_key]).forEach(function(key){
          var current_li = create_card_li(analyze_array[analyze_key][key],key);
          
          var remove_button = create_remove_button(key);
          $(remove_button).on( 'click', function(){
            remove_card_from_analyze(analyze_key, key, analyze_array[analyze_key][key], analyze_selector, deck_list_selector);
          });
          $(current_li).append(remove_button);
          
          $(current_ul).append(current_li);
        });
        
        $(current_ul).droppable({
          greedy:true,
          items: 'li:not(.analyze_intro)',
          accept: 'li.deck_list_card',
          hoverClass: 'analyze_hover',
          drop: function(event, ui){
            var card_id = $(ui.draggable).attr('card_id');
            var card_copy = $.extend({key:card_id}, deck_array[card_id]);
        
            analyze_array[$(this).attr('analyze_key')].push(card_copy);
            
            // remove card from deck list
            remove_card_from_deck(card_id, deck_list_selector, true);
            
            // refresh results
            refresh_analyze_results();
            
            refresh_analyze_list(analyze_selector, deck_list_selector);
          }
        });
        
        $(analyze_selector).append(current_ul);
      }
      
    });
  }
  
}

// uses analyze_array
function refresh_analyze_results(){
  var results_selector = 'div.analyze_results';
  
  $.ajax(document.URL + '.json', {
    data: {
      analyze: JSON.stringify(analyze_array)
    },
    method: "GET",
    success: function(data){
      var message = 'Chance of getting combo in opening hand: ' + data.chance + '%';
      $(results_selector).html(message);
    },
    error: function(data){
      $(results_selector).html('Error. Please refresh the page and try again.');
    }
  });
}


// helper functions

function create_card_li(card,key){
  var card_li = document.createElement('li');
  $(card_li).addClass('deck_list_card');
  
  // add card li contents
  // create h3 for card quantity
  var h3 = document.createElement('h3');
  $(h3).addClass('card_quantity');
  $(h3).html(card.quantity);
  
  $(card_li).html(card.name);
  $(card_li).prepend(h3);
  
  // add card ID
  $(card_li).attr('card_id', key);
  
  // add card type to style
  // must make card type lowercase
  card_type = (card.type).toLowerCase();
  $(card_li).addClass(card_type);
  
  return card_li;
}

function add_card_to_deck(card, list_selector, immutable){
  // add card to deck_array
  deck_array.push(card);
  
  // refresh deck after add
  refresh_deck_list(list_selector, !(immutable));
}

function add_card_to_analyze(card_id){
  
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
function remove_card_from_deck(remove_id, list_selector, immutable){
  // remove from deck_array
  deck_array.splice(remove_id, 1);
  
  // refresh after removal
  refresh_deck_list(list_selector, !(immutable));
}

function remove_card_from_analyze(analyze_key, key, card, analyze_selector, deck_list_selector){
  analyze_array[analyze_key].splice(key, 1);
  if(analyze_array[analyze_key].length == 0){
    analyze_array.splice(analyze_key, 1);
  }
  add_card_to_deck(card, deck_list_selector, true);
  refresh_analyze_list(analyze_selector, deck_list_selector);
}

function change_position_in_deck(old_id, new_id, mutable){
  deck_array.splice(new_id, 0, deck_array.splice(old_id, 1)[0]);
}