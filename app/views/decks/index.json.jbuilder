json.array!(@decks) do |deck|
  json.extract! deck, :id, :owner, :name, :contents, :notes
  json.url deck_url(deck, format: :json)
end
