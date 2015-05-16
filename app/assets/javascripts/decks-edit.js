ng_deck_test.controller('ng_c_deck_list', function($scope){
  $scope.deck = deck_array;
  
  // initialize card inputs
  // set default values for selects
  $scope.card_name = '';
  $scope.card_quantity = '1';
  $scope.card_type = 'Monster';

  $scope.plus_card_quantity = function(e){
    var c_name = $( e.currentTarget ).parent().attr('card_name');
    var c_index = find_card_index($scope.deck, c_name);
    if($scope.deck[c_index].quantity < 3){
      $scope.deck[c_index].quantity++;
    }
  };
  
  $scope.minus_card_quantity = function(e){
    var c_name = $( e.currentTarget ).parent().attr('card_name');
    var c_index = find_card_index($scope.deck, c_name);
    if($scope.deck[c_index].quantity > 1){
      $scope.deck[c_index].quantity--;
    }//else if($scope.deck[c_index].quantity == 1){ $scope.deck.splice(c_index, 1); }
  };
  
  $scope.add_card_to_deck = function(){
    var card = create_card($scope.card_name, $scope.card_quantity, $scope.card_type);
    if(card){
      if(find_card_index($scope.deck, card.name) === false){
        $scope.deck.push(card);
      }else{
        alert('Card already in deck.');
      }
    }
  };
  
  $scope.remove_card_from_deck = function(e){
    var c_name = $( e.currentTarget ).parent().attr('card_name');
    var remove_i = find_card_index($scope.deck, c_name);
    $scope.deck.splice(remove_i, 1);
  };
  
  // deck check and add deck meta
  $scope.deck_check = function(e){
    // validate form
    var d_name = $(e.currentTarget).find('input#deck_name').val();
    if(d_name == ""){
      alert("Please enter a deck name.");
      e.preventDefault();
    }
    // var d_notes = $(e.currentTarget).find('textarea#deck_notes').val();
    var deck_count = 0;
    // check for 40 cards
    Object.keys($scope.deck).forEach(function(key){
      deck_count += $scope.deck[key].quantity;
    });
    if(deck_count <= 60 && deck_count >= 40){
      var deck_json = angular.toJson($scope.deck);
      $('input#f_contents').val(deck_json);
    }else{
      alert('Please enter a deck with 40 to 60 cards.');
      e.preventDefault();
    }
  };
});