import { useEffect } from "react";
import { useState } from "react";
import Card from "../components/Card";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [sort, setSort] = useState("asc");
  const [submited, setSubmited] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePhoto = async (id) => {
    await fetch(
      `https://gallery-app-server.vercel.app/photos/${photos[(id -= 1)].id}`,
      {
        method: "DELETE",
      }
    );
    const elements = document.getElementsByClassName("card");
    elements[id].parentNode.removeChild(elements[id]);
  };

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://gallery-app-server.vercel.app/photos?_sort=${search}&_order=${sort}&q=${search}`
    )
      .then((response) => response.json())
      .then((json) => {
        setPhotos(json);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    // TODO: answer here
  }, [sort, search, submited]);

  useEffect(() => {
    setLoading(true);
    fetch("https://gallery-app-server.vercel.app/photos")
      .then((response) => response.json())
      .then((json) => {
        setPhotos(json);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    // TODO: answer here
  }, []);

  if (sort === "asc") {
    photos.sort((a, b) => a.id - b.id);
  } else {
    photos.sort((a, b) => b.id - a.id);
  }

  if (error)
    return (
      <h1 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
        Error!
      </h1>
    );

  return (
    <>
      <div className="container">
        <div className="options">
          <select
            onChange={(e) => setSort(e.target.value)}
            data-testid="sort"
            className="form-select"
            style={{}}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmited(search);
            }}
          >
            <input
              type="text"
              data-testid="search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
            />
            <input
              type="submit"
              value="Search"
              data-testid="submit"
              className="form-btn"
            />
          </form>
        </div>
        <div className="content">
          {loading ? (
            <h1
              style={{ width: "100%", textAlign: "center", marginTop: "20px" }}
            >
              Loading...
            </h1>
          ) : (
            photos.map((photo) => {
              return (
                <Card key={photo.id} photo={photo} deletePhoto={deletePhoto} />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Photos;
