import "./ModifyListings.css"

function ModifyListings() {
  return (
    <div>
         <main>
        <section className="hotel-listing">
            #Hotel #1
            <div className="listing-field">
                <label htmlFor="hotel1">Hotel #1:</label>
                <input type="text" id="hotel1" name="hotel1" placeholder="Enter hotel name"/>
                <button className="update-btn">Update</button>
            </div>

            #Image
            <div className="listing-field">
                <label htmlFor="hotelImage">Hotel Image:</label>
                <input type="text" id="hotelImage" name="hotelImage" placeholder="Enter image URL"/>
                <button className="update-btn">Update</button>
            </div>

            #Description
            <div className="listing-field">
                <label htmlFor="hotelDescription">Hotel Description:</label>
                <input type="text" id="hotelDescription" name="hotelDescription" placeholder="Enter description"/>
                <button className="update-btn">Update</button>
            </div>
		
		#Amenities
            <div className="listing-field">
                <label htmlFor="hotelAmenities">Hotel Amenities:</label>
                <input type="text" id="hotelDescription" name="hotelDescription" placeholder="Enter amenities"/>
                <button className="update-btn">Update</button>
            </div>


            #Price per Night
            <div className="listing-field">
                <label htmlFor="hotelPrice">Price per Night:</label>
                <input type="text" id="hotelPrice" name="hotelPrice" placeholder="Enter price per night"/>
                
                <button className="update-btn">Update</button>
            </div>

            #Availability
            <div className="listing-field">
                <label htmlFor="availability">Availability:</label>
                <select id="availability" name="availability">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <button className="update-btn">Update</button>
            </div>
        </section>
    </main>

      
    </div>
  )
}

export default ModifyListings
