import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postman } from '../../postman.ts';
import ImageCarousel from '../rooms/ImageCarousel';
import './SearchFilter.css';

function SearchFilter() {
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [amenities, setAmenities] = useState<string>('');
    const [minRating, setMinRating] = useState<number | undefined>(undefined);
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
            setError('Minimum price cannot be greater than maximum price.');
            return;
        }
        if (minRating !== undefined && (minRating < 0 || minRating > 5)) {
            setError('Rating must be between 0 and 5.');
            return;
        }

        setError(null); // Clear previous errors
        setLoading(true);

        try {
            let response = await postman.get('/filter/filter', {
                params: {
                    ...(city && { city }),
                    ...(state && { state }),
                    ...(minPrice !== undefined && { minPrice }),
                    ...(maxPrice !== undefined && { maxPrice }),
                    ...(amenities && { amenities }),
                    ...(minRating !== undefined && { minRating }),
                },
            });

            console.log('Response:', response.data);
            setHotels(response.data);
            setShowResults(true);
        } catch (err) {
            console.log('Error fetching hotels', err);
            setError('Unable to load hotels.');
        } finally {
            setLoading(false);
        }
    };

    const handleMoreInfo = (hotelId: string) => {
        navigate(`/hotel/${hotelId}`);
    };

    return (
        <div>
            <div className="page-container">
                <div className="search-filter">
                    <h1>Search Hotels</h1>
                    <div className="form-group">
                        <label>
                            City:
                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            State:
                            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Minimum Price:
                            <input
                                type="number"
                                value={minPrice || ''}
                                onChange={(e) => setMinPrice(Number(e.target.value) || undefined)}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Maximum Price:
                            <input
                                type="number"
                                value={maxPrice || ''}
                                onChange={(e) => setMaxPrice(Number(e.target.value) || undefined)}
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Amenities:
                            <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
                        </label>
                    </div>
                    <div className="form-group">
                        <label>
                            Minimum Rating:
                            <input
                                type="number"
                                value={minRating || ''}
                                onChange={(e) => setMinRating(Number(e.target.value) || undefined)}
                            />
                        </label>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button className="search-hotel" onClick={handleSearch} disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
            <div>
                {showResults && (
                    <div className="results">
                        <h2>Results</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : hotels.length > 0 ? (
                            <ul>
                                {hotels.map((hotel) => (
                                    <li key={hotel.id} className="hotel-item">
                                        <div>
                                            <ImageCarousel
                                                images={hotel.images}
                                                altText={`Hotel ${hotel.name}`}
                                                variant="detail"
                                            />
                                        </div>
                                        <div>
                                            <h3>{hotel.name}</h3>
                                            <p>
                                                <strong>Location:</strong>
                                                <br />
                                                {hotel.city}, {hotel.state}
                                            </p>
                                            <p>
                                                <strong>Rating:</strong>
                                                <br />
                                                {hotel.rating}
                                            </p>
                                            <p>
                                                <strong>Description:</strong>
                                                <br />
                                                {hotel.description}
                                            </p>
                                            <p>
                                                <strong>Amenities:</strong>
                                                <br />
                                                {hotel.amenities}
                                            </p>
                                            <button className="more-info-button" onClick={() => handleMoreInfo(hotel.id)}>More Info</button>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No hotels found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchFilter;