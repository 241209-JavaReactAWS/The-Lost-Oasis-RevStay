import "./ViewHotels.css"

function ViewHotels() {
  return (
    <div>
          #Filter Button
    <div className="filter-container">
        <button className="filter-btn">Filter</button>
    </div>

    #Hotel Cards Section
    <main className="hotel-cards">
        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 1"/>
            <h3>Hotel 1</h3>
            <span className="favorite">&#9733;</span> 
            <p className="description">A cozy place with great amenities.</p>
            <p className="amenities">Wi-Fi, Pool, Spa</p>
            <p className="price">$120 per night</p>
            <p className="availability">Available</p>
        </div>

        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 2"/>
            <h3>Hotel 2</h3>
            <span className="favorite">&#9733;</span>
            <p className="description">Modern hotel with city views.</p>
            <p className="amenities">Gym, Wi-Fi, Breakfast</p>
            <p className="price">$150 per night</p>
            <p className="availability">Not Available</p>
        </div>

        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 3"/>
            <h3>Hotel 3</h3>
            <p className="description">Luxury stay in the heart of the city.</p>
            <p className="amenities">Pool, Gym, Bar</p>
            <p className="price">$200 per night</p>
            <p className="availability">Available</p>
        </div>

        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 4"/>
            <h3>Hotel 4</h3>
            <span className="favorite">&#9733;</span>
            <p className="description">Great for family vacations.</p>
            <p className="amenities">Wi-Fi, Restaurant, Spa</p>
            <p className="price">$100 per night</p>
            <p className="availability">Available</p>
        </div>

        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 5"/>
            <h3>Hotel 5</h3>
            <p className="description">Charming boutique hotel.</p>
            <p className="amenities">Breakfast, Wi-Fi, Pool</p>
            <p className="price">$90 per night</p>
            <p className="availability">Not Available</p>
        </div>

        <div className="card">
            <img src="https://via.placeholder.com/200" alt="Hotel 6"/>
            <h3>Hotel 6</h3>
            <span className="favorite">&#9733;</span>
            <p className="description">Stylish hotel with excellent service.</p>
            <p className="amenities">Gym, Restaurant, Wi-Fi</p>
            <p className="price">$180 per night</p>
            <p className="availability">Available</p>
        </div>
    </main>

      
    </div>
  )
}

export default ViewHotels
