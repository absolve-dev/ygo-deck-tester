ng_deck_test.controller('ng_c_deck_analyze', function($scope){
  $scope.deck = deck_array;
  
  $scope.analyze = [];
  $scope.a_blacklist = [];
  
  $scope.results_first = false;
  $scope.results_second = false;
  
  // init sortables
  $(document).ready(function(){
    $('ul.deck_list').sortable({
      connectWith: 'div.analyze_drop'
    });
    $('div.analyze_drop').droppable({
      greedy:true,
      accept: 'ul.deck_list li.card',
      hoverClass: 'analyze_hover',
      drop: function(event, ui){
        var card_name = $(ui.draggable).attr('card_name');
        var card_index = find_card_index($scope.deck, card_name);
        var card = $scope.deck[card_index];
        $scope.add_card_to_analyze(card);
      }
    });
    
    init_or_boxes();
  });
  
  $scope.add_card_to_analyze = function(card){
    if( find_card_index($scope.a_blacklist, card.name) === false ){
      $scope.analyze.push([card]);
      $scope.$apply();
      add_card_to_blacklist(card.name);
      init_or_boxes();
    }else{
      alert('Cannot add a card already in the analysis.');
    }
  };
  $scope.add_card_to_analyze_by_index = function(card, index){
    if( find_card_index($scope.a_blacklist, card.name) === false ){
      $scope.analyze[index].push(card);
      $scope.$apply();
      add_card_to_blacklist(card.name);
      init_or_boxes();
    }else{
      alert('Cannot add a card already in the analysis.');
    }
  }
  
  $scope.remove_card_from_analyze = function(e){
    var c_name = $( e.currentTarget ).parent().attr('card_name');
    var analyze_index = $( e.currentTarget ).parent().parent().attr('analyze_index');
    var remove_i = find_card_index($scope.analyze[analyze_index], c_name);
    $scope.analyze[analyze_index].splice(remove_i, 1);
    remove_card_from_blacklist(c_name);
    // splice empty
    if( $scope.analyze[analyze_index].length == 0){
      $scope.analyze.splice(analyze_index, 1);
    }
  };
  
  function add_card_to_blacklist(c_name){
    $scope.a_blacklist.push({name:c_name});
    refresh_analyze_results();
  }
  function remove_card_from_blacklist(c_name){
    var remove_i = find_card_index($scope.a_blacklist, c_name);
    $scope.a_blacklist.splice(remove_i, 1);
    refresh_analyze_results();
  }
  
  function init_or_boxes(){
    $('ul.analyze_list').droppable({
      greedy:true,
      //items: 'li:not(.analyze_intro)',
      accept: 'ul.deck_list li.card',
      hoverClass: 'analyze_hover',
      drop: function(event, ui){
        var card_name = $(ui.draggable).attr('card_name');
        var card_index = find_card_index($scope.deck, card_name);
        var card = $scope.deck[card_index];
        var analyze_index = $(this).attr('analyze_index');
        $scope.add_card_to_analyze_by_index(card, analyze_index);
      }
    });
  }
  
  function refresh_analyze_results(){
    $.ajax(document.URL + '.json', {
      data: {
        analyze: JSON.stringify($scope.analyze)
      },
      method: "GET",
      success: function(data){
        $scope.results_first = data[0];
        $scope.results_second = data[1];
      },
      error: function(data){
        alert('Error. Please refresh the page and try again.');
      }
    });
  }
  
});