class CreateDecks < ActiveRecord::Migration
  def change
    create_table :decks do |t|
      t.integer :owner
      t.string :name
      t.string :contents
      t.string :notes

      t.timestamps null: false
    end
  end
end
