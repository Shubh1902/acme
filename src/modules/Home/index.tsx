import { Box, Container, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import FuzzySearch from 'fuzzy-search';
import _ from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import InfiniteTable, {
  TableColumnsInterface,
  TableRowsInterface,
} from 'src/components/InfiniteTable';
import Navbar from 'src/components/Navbar';
import { COLUMNS, FILTER_OPTIONS } from 'src/modules/Home/constants';
import { createRowData } from 'src/modules/Home/helper';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
function fetchData(offset: number) {
  return axios
    .get(`https://jsonplaceholder.typicode.com/albums/${offset}/photos`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export interface DataResponse {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}
const Home = () => {
  const [offset, setOffset] = useState<number>(1);
  const [originalData, setOriginalData] = useState<DataResponse[]>([]);
  const [formattedData, setFormattedData] = useState<{
    rows: TableRowsInterface[];
    columns: TableColumnsInterface[];
  }>({
    rows: [],
    columns: COLUMNS,
  });
  const [filteredData, setFilteredData] = useState<{
    rows: TableRowsInterface[];
    columns: TableColumnsInterface[];
  }>({
    rows: [],
    columns: COLUMNS,
  });
  const [searchString, setSearchString] = useState<string>('');
  const [filter, setFilter] =
    useState<null | { id: string; name: string }>(null);

  const loadData = () => {
    fetchData(offset)
      .then((res) => handleResponse(res))
      .catch((e) => console.log(e));
  };

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchString(input);
  };
  const changeFilter = (value: { id: string; name: string } | null) => {
    setFilter(value);
    if (!value) {
      setSearchString('');
    }
  };
  const handleResponse = (res: DataResponse[]) => {
    setOriginalData((prev) => prev.concat(res));
    setFormattedData((prev) => ({
      ...prev,
      rows: prev.rows.concat(createRowData(res)),
    }));
    setOffset((prev) => prev + 1);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!searchString) {
      setFilteredData(formattedData);
    } else {
      debouncedSearch(searchString);
    }
  }, [searchString, formattedData]);

  const search = (searchString: string) => {
    const searcher = new FuzzySearch(formattedData.rows, ['title'], {
      caseSensitive: false,
    });
    setFilteredData({
      columns: COLUMNS,
      rows: searcher.search(searchString),
    });
  };
  const debouncedSearch = _.debounce(search, 400);
  return (
    <Container disableGutters>
      <Navbar />
      <Box display="flex" flexDirection="row">
        <Autocomplete
          id="filter"
          options={FILTER_OPTIONS}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Filter" />}
          value={filter}
          onChange={(event, value) => {
            changeFilter(value);
          }}
        ></Autocomplete>
        <TextField
          id="search"
          label={' '}
          fullWidth
          onChange={handleSearchInputChange}
          value={searchString}
          placeholder={
            filter ? `Enter ${filter.name}` : `Select Filter to search`
          }
          disabled={!filter}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <InfiniteTable
        {...filteredData}
        onRowClick={() => {}}
        onSelectionChange={() => {}}
        fetchData={loadData}
      />
    </Container>
  );
};
export default Home;
