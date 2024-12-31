import "./GuestBookings.css"

function GuestBookings() {
  return (
    <div>
         <main>
        <section className="booking-details">
            #Guest Name
            <div className="booking-field">
                <label htmlFor="guestName">Guest Name:</label>
                <input type="text" id="guestName" name="guestName" placeholder="Enter guest name"/>
            </div>

            #Hotel Name
            <div className="booking-field">
                <label htmlFor="hotelName">Hotel Name:</label>
                <span id="hotelName">Fictional Hotel</span>
            </div>

            #Room Type
            <div className="booking-field">
                <label htmlFor="roomType">Room Type:</label>
                <select id="roomType" name="roomType">
                    <option value="studio">Studio</option>
                    <option value="suite">Suite</option>
                    <option value="king-size">1 King Size Bed</option>
                    <option value="queen-size">2 Queen Size Beds</option>
                </select>
            </div>

            #Check-in Date
            <div className="booking-field">
                <label htmlFor="checkInDate">Check-in Date:</label>
                <input type="date" id="checkInDate" name="checkInDate"/>
            </div>

            #Checkout Date
            <div className="booking-field">
                <label htmlFor="checkOutDate">Checkout Date:</label>
                <input type="date" id="checkOutDate" name="checkOutDate"/>
            </div>

            #Buttons
            <div className="buttons">
                <button className="modify">Modify Booking</button>
                <button className="review">Write A Review</button>
                <button className="cancel">Cancel Booking</button>
            </div>
        </section>
    </main>

      
    </div>
  )
}

export default GuestBookings
