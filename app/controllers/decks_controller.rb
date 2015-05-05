class DecksController < ApplicationController
  before_action :set_deck, only: [:show, :edit, :update, :destroy, :analyze]

  # GET /decks
  # GET /decks.json
  def index
    @decks = Deck.all
  end

  # GET /decks/1
  # GET /decks/1.json
  def show
  end

  # GET /decks/new
  def new
    @deck = Deck.new
  end

  # GET /decks/1/edit
  def edit
  end

  # POST /decks
  # POST /decks.json
  def create
    @deck = Deck.new(deck_params)

    respond_to do |format|
      if @deck.save
        format.html { redirect_to @deck, notice: 'Deck was successfully created.' }
        format.json { render :show, status: :created, location: @deck }
      else
        format.html { render :new }
        format.json { render json: @deck.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /decks/1
  # PATCH/PUT /decks/1.json
  def update
    respond_to do |format|
      if @deck.update(deck_params)
        format.html { redirect_to @deck, notice: 'Deck was successfully updated.' }
        format.json { render :show, status: :ok, location: @deck }
      else
        format.html { render :edit }
        format.json { render json: @deck.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /decks/1
  # DELETE /decks/1.json
  def destroy
    @deck.destroy
    respond_to do |format|
      format.html { redirect_to decks_url, notice: 'Deck was successfully destroyed.' }
      format.json { head :no_content }
    end
  end
  
  # GET /decks/1/analyze
  # GET /decks/1/analyze.json
  def analyze
    respond_to do |format|
      format.html { render :analyze }
      format.json do
        deck_array = JSON.parse(@deck.contents)
        desired_array = JSON.parse(params[:analyze])
        
        # global 'chance' variable
        # chance is in percentage points
        @result = {chance:0.0}
        
        # depth = how many draws left
        # n_d_pairs empty at first iteration
        def dig(desired_arr, deck_total, depth, n_d_pairs)
          
          def recur(new_desired, temp_total, new_depth, n_d_pair, old_n_d)
            # if depth is > 0
            if new_depth > 0
              # add n/d pairs
              new_n_d_pairs = Array.new(old_n_d).push(n_d_pair)
              # deck_total -1
              # recur
              dig(new_desired, temp_total-1, new_depth, new_n_d_pairs)
              
            # else nothing
            end
          end
          
          # count total desired
          total_desired = 0
          
          # foreach in desired( n_d_pairs)
          desired_arr.map.with_index do |a, i|
            # new array, remove current from desired
            new = Array.new(desired_arr)
            new.delete_at(i)
            
            # n/d pair: desired.quantity (of all possibilities) / deck total
            numerator = 0
            a.each { |x|
              numerator += x['quantity']
              # add to total desired
              total_desired += x['quantity']
            }
            denominator = deck_total
                        
            # if desired is empty
            if new.count == 0
              # if n_d_pairs is empty
              if n_d_pairs.count == 0
                # calculate and add to chance
                chance = numerator.to_f / denominator.to_f * 100.0
                @result[:chance] += chance
              else
                # foreach in n_d_pairs
                n_d_pairs.each{ |x|
                  # multiply all nums
                  numerator *= x[0]
                  # multiply all denoms
                  denominator *= x[1]
                }  
                
                # final calculation
                chance = numerator.to_f / denominator.to_f * 100.0  
                @result[:chance] += chance
              end
            else
              # recur with new desired
              n_d_pair = [numerator,denominator]
              recur(new, deck_total, depth-1, n_d_pair, n_d_pairs)
              
            end
            
          end
          
          # recur with current desired, get undesireds
          total_undesired = deck_total - total_desired
          recur(desired_arr,deck_total, depth-1, [total_undesired,deck_total], n_d_pairs)
          
        end
        
       
          # remove from desired, if exists
          
          # recur for drawing non-desired
          
        # recur function
          
        
        total = 0;
        deck_array.each { |x|
          total += x['quantity']
        }
        
        # start digging
        dig(desired_array, total, 5, [])
                  
        # 2 is a good number
        @result[:chance] = @result[:chance].round(2)      
        render json: @result
      end
    end
  end
    
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_deck
      @deck = Deck.find(params[:id])
      # remove all single quotes for security+usability
      @deck[:contents].gsub!("'", "")
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def deck_params
      params.require(:deck).permit(:owner, :name, :contents, :notes)
    end
end
