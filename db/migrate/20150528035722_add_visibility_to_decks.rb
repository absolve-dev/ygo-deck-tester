class AddVisibilityToDecks < ActiveRecord::Migration
  def change
    add_column :decks, :visibility, :string
    
    # make each deck public
    decks = Deck.all
    decks.each { |deck|
      deck.update_attribute(:visibility, 'public')
      deck.save
    }
  end
end
