import "./Search.css"

function Search() {
  return (
    <div>
        <main>
        <section className="search-box">
            <form action="#" method="get">
                <div className="search-area">
                    <label htmlFor="searchText">Search All Hotels</label>
                    
                    <button type="submit">Go!</button>
                </div>

                <div className="field-group">
                    <label htmlFor="hotelName">Name:</label>
                    <input type="text" id="hotelName" name="hotelName" placeholder="Enter hotel name"/>
                </div>

                <div className="field-group">
                    <label htmlFor="priceRange">Price Range:</label>
                    <input type="text" id="priceRange" name="priceRange" placeholder="Enter price range"/>
                </div>

                <div className="field-group">
                    <label htmlFor="location">Location:</label>
                    <input type="text" id="location" name="location" placeholder="Enter location"/>
                </div>

                <div className="field-group">
                    <label htmlFor="amenities">Amenities:</label>
                    <input type="text" id="amenities" name="amenities" placeholder="Enter amenities"/>
                </div>

                <div className="field-group">
                    <label htmlFor="userReview">User Review:</label>
                    <select id="userReview" name="userReview">
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                </div>
            </form>
        </section>
    </main>

      
    </div>
  )
}

export default Search
