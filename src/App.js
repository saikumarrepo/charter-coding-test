import React from "react";
import Pagination from "./Pagination";
import "./style.css";

class App extends React.Component {
  state = {
    searchResult: null,
    keyword: "",
    selectedShow: null,
    filter: {
      state: "",
      genre: ""
    },
    filteredData: [],
    currentPage: 1,
    totalPages: 0,
    currentData: [],
    pageLimit: 10
  };

  componentDidMount() {
    this.updateSearch(this.state.keyword);
  }

  applySearch = keyword => {
    let filteredData = this.state.searchResult.filter(el => {
      return (
        el.name.toLocaleLowerCase().startsWith(keyword.toLocaleLowerCase()) ||
        el.genre.toLocaleLowerCase().startsWith(keyword.toLocaleLowerCase()) ||
        el.city.toLocaleLowerCase().startsWith(keyword.toLocaleLowerCase())
      );
    });
    const offset = (this.state.currentPage - 1) * this.state.pageLimit;
    const currentData = filteredData.slice(
      offset,
      offset + this.state.pageLimit
    );
    this.setState({ filteredData, currentData });
  };

  applyFilter = (type, val) => {
    let filter = this.state.filter;
    filter[type] = val;
    let filteredData = this.state.searchResult.filter(el => {
      return (
        el.state
          .toLocaleLowerCase()
          .startsWith(this.state.filter.state.toLocaleLowerCase()) &&
        el.genre
          .toLocaleLowerCase()
          .startsWith(this.state.filter.genre.toLocaleLowerCase())
      );
    });
    const offset = (this.state.currentPage - 1) * this.state.pageLimit;
    const currentData = filteredData.slice(
      offset,
      offset + this.state.pageLimit
    );
    this.setState({ filteredData, filter, currentData });
  };

  updateSearch = () => {
    fetch("https://code-challenge.spectrumtoolbox.com/api/restaurants", {
      headers: {
        Authorization: "Api-Key q3MNxtfep8Gt"
      }
    })
      .then(res => res.json())
      .then(result => {
        result.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          }
          return 0;
        });

        this.setState({
          searchResult: result,
          filteredData: result,
          totalPages: result.length
        });
      });
  };

  onPageChanged = data => {
    const { filteredData } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentData = filteredData.slice(offset, offset + pageLimit);

    this.setState({ currentPage, currentData, totalPages });
  };

  render() {
    return (
      <div>
        <nav className="navbar">Restaurants Hub</nav>
        <div className="search-form">
          <input
            value={this.state.keyword}
            placeholder="search"
            onChange={e => {
              this.setState({ keyword: e.target.value });
            }}
            onKeyDown={e => {
              e.key === "Enter" && this.applySearch(this.state.keyword);
            }}
          />
          <button
            className="sbutton"
            onClick={() => {
              this.applySearch(this.state.keyword);
            }}
          >
            Search
          </button>
        </div>
        <div>
          {
            <table className="table-container">
              <thead>
                <tr>
                  <th>-</th>
                  <th>-</th>
                  <th>
                    <input
                      placeholder="Filter by state"
                      value={this.state.filter.state}
                      onChange={e => this.applyFilter("state", e.target.value)}
                    />
                  </th>
                  <th>-</th>
                  <th>
                    <input
                      placeholder="Filter by genre"
                      value={this.state.filter.genre}
                      onChange={e => this.applyFilter("genre", e.target.value)}
                    />
                  </th>
                </tr>
                {this.state.filteredData.length > 0 && (
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Phone</th>
                    <th>Genres</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {this.state.currentData &&
                  this.state.currentData.map((el, i) => (
                    <tr key={i}>
                      <td>{el.name}</td>
                      <td>{el.city}</td>
                      <td>{el.state}</td>
                      <td>{el.telephone}</td>
                      <td>{el.genre}</td>
                    </tr>
                  ))}
                {this.state.filteredData.length === 0 && (
                  <tr>
                    <td colSpan="5" className="txt-center">
                      <strong>No Result Found</strong>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {this.state.filteredData.length > 10 && (
                  <tr>
                    <td colSpan="5" className="txt-center">
                      <Pagination
                        totalRecords={this.state.searchResult.length}
                        pageLimit={10}
                        pageNeighbours={1}
                        onPageChanged={this.onPageChanged}
                      />
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          }
        </div>
      </div>
    );
  }
}

export default App;
