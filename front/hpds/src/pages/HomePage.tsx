import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Button from "react-bootstrap/Button";
import { AxiosContextType } from "../axios/AxiosProvider";
import AxiosContext from "../axios/AxiosProvider";
import { useState, useEffect, useContext } from "react";
import { POPULAR_DESTINATIONS_ENDPOINT } from "../consts/consts";
import PopularDestinationResponseType from "../responesTypes/PopularDestinationResponseType";
import { useNavigate } from "react-router-dom";
import SearchParams from "../requestsTypes/SearchParams";

function HomePage() {
  const [popularDestinations, setPopularDestinations] = useState<
    PopularDestinationResponseType[]
  >([]);
  const { axiosInstance } = useContext(AxiosContext) as AxiosContextType;
  const [searchParams, setSearchParams] = useState<SearchParams>({
    country: "",
    city: "",
    whenFrom: null,
    whenTo: null,
    howLongFrom: 7,
    howLongTo: 10,
    fromCity: "",
    fromCountry: "",
    typeOfTransport: "",
    adults: 2,
    upTo3: 0, 
    upTo10: 0,
    upTo18: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        const response = await axiosInstance.get<
          PopularDestinationResponseType[]
        >(POPULAR_DESTINATIONS_ENDPOINT);
        setPopularDestinations(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  return (
    <>
      <NavBar />
      <SearchBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <div className="page-content">
        <div className="page-title">Popular directions</div>
        {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
        {!loading &&
          popularDestinations.map((item) => (
            <div className="page-section-content">
              <div className="elements">
                <div className="left-50 font-size-36">{item.country}</div>
                <div className="right-50 font-size-36">
                  <Button
                    variant="secondary"
                    className="font-size-36"
                    onClick={() => {
                      navigate("/searchresult", {
                        state: { searchParams: {
                          ...searchParams,
                          ["country"]: item.country,
                        } },
                      });
                    }}
                  >
                    Check offers
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default HomePage;
