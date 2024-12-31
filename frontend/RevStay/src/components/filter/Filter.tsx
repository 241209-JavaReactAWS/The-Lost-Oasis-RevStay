import "./Filter.css"

function Filter() {
  return (
    <div>
      <body>

#Filter Box
<div className="filter-box">
    <h2>Filter Hotels By:</h2>

    #Price Range
    <div className="filter-field">
        <label htmlFor="priceRange">Price Range:</label>
        <select id="priceRange" name="priceRange">
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200-1000">$200 - $1000</option>
        </select>
    </div>

    #Location
    <div className="filter-field">
        <label htmlFor="location">Location:</label>
        <select id="location" name="location">
            <option value="alabama">Alabama</option>
  <option value="alaska">Alaska</option>
  <option value="arizona">Arizona</option>
  <option value="arkansas">Arkansas</option>
  <option value="california">California</option>
  <option value="colorado">Colorado</option>
  <option value="connecticut">Connecticut</option>
  <option value="delaware">Delaware</option>
  <option value="florida">Florida</option>
  <option value="georgia">Georgia</option>
  <option value="hawaii">Hawaii</option>
  <option value="idaho">Idaho</option>
  <option value="illinois">Illinois</option>
  <option value="indiana">Indiana</option>
  <option value="iowa">Iowa</option>
  <option value="kansas">Kansas</option>
  <option value="kentucky">Kentucky</option>
  <option value="louisiana">Louisiana</option>
  <option value="maine">Maine</option>
  <option value="maryland">Maryland</option>
  <option value="massachusetts">Massachusetts</option>
  <option value="michigan">Michigan</option>
  <option value="minnesota">Minnesota</option>
  <option value="mississippi">Mississippi</option>
  <option value="missouri">Missouri</option>
  <option value="montana">Montana</option>
  <option value="nebraska">Nebraska</option>
  <option value="nevada">Nevada</option>
  <option value="new_hampshire">New Hampshire</option>
  <option value="new_jersey">New Jersey</option>
  <option value="new_mexico">New Mexico</option>
  <option value="new_york">New York</option>
  <option value="north_carolina">North Carolina</option>
  <option value="north_dakota">North Dakota</option>
  <option value="ohio">Ohio</option>
  <option value="oklahoma">Oklahoma</option>
  <option value="oregon">Oregon</option>
  <option value="pennsylvania">Pennsylvania</option>
  <option value="rhode_island">Rhode Island</option>
  <option value="south_carolina">South Carolina</option>
  <option value="south_dakota">South Dakota</option>
  <option value="tennessee">Tennessee</option>
  <option value="texas">Texas</option>
  <option value="utah">Utah</option>
  <option value="vermont">Vermont</option>
 <option value="virginia">Virginia</option>
  <option value="washington">Washington</option>
  <option value="west_virginia">West Virginia</option>
  <option value="wisconsin">Wisconsin</option>
  <option value="wyoming">Wyoming</option>
            #Add all 50 states here
        </select>
    </div>

    #Amenities
    <div className="filter-field">
        <label htmlFor="amenities">Amenities:</label>
        <select id="amenities" name="amenities">
            <option value="pool">Pool</option>
            <option value="breakfast">Breakfast</option>
            <option value="fitness">Fitness Room</option>
            <option value="laundry">On-Site Laundry</option>
            <option value="shuttle">Shuttle Bus</option>
        </select>
    </div>

    #User Review
    <div className="filter-field">
        <label htmlFor="userReview">User Review:</label>
        <select id="userReview" name="userReview">
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
        </select>
    </div>

    #Favorited
    <div className="filter-field">
        <label htmlFor="favorited">Favorited:</label>
        <input type="checkbox" id="favorited" name="favorited"/>
    </div>

    <button className="filter-btn">Apply Filter</button>
</div>

</body>

      
    </div>
  )
}

export default Filter



