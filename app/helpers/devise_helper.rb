#/deck-tester/app/helpers/devise_helper.rb
module DeviseHelper
   def devise_error_messages!
      return "" if resource.errors.empty?
      return resource.errors
   end
end