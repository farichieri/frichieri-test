import "./searchbar.scss";

const Searchbar = () => {
  return (
    <div className="searchbar">
      <input type="text" className="searchInput" placeholder="Search..." />
      <button className="searchBtn">Search</button>
    </div>
  );
};

export default Searchbar;