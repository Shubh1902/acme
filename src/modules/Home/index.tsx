import { Box, Container, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import _ from 'lodash';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import InfiniteTable, {
  TableColumnsInterface,
  TableRowsInterface,
} from 'src/components/InfiniteTable';
import Navbar from 'src/components/Navbar';
import { COLUMNS, FILTER_OPTIONS } from 'src/modules/Home/constants';
import { createDebouceFn, createRowData } from 'src/modules/Home/helper';
import 'src/modules/Home/style.css';
function fetchData(
  start: number = 0,
  searchString: string = '',
  resolve: Function
) {
  return axios
    .get(
      `https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=10&q=${searchString}`
    )
    .then((res) => resolve(res.data))
    .catch((err) => console.log(err));
}
const debouncedFetch = createDebouceFn(fetchData, 400);

export interface DataResponse {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}
const Home = () => {
  const [start, setStart] = useState<number>(0);
  const [data, setData] = useState<DataResponse[]>([]);
  //TODO: hasMore
  const [hasMore, setHasMore] = useState(true);
  const [formattedData, setFormattedData] = useState<{
    rows: TableRowsInterface[];
    columns: TableColumnsInterface[];
  }>({
    rows: [],
    columns: COLUMNS,
  });

  const [searchString, setSearchString] = useState<string>('');
  const [filter, setFilter] =
    useState<null | { id: string; name: string }>(null);

  const handleInitResponse = (data: DataResponse[]) => {
    if (data.length < 10) {
      setHasMore(false);
    }
    setData(data);
    setFormattedData({
      rows: createRowData(data),
      columns: COLUMNS,
    });
    setStart((prev) => prev + 10);
  };

  const addRows = (data: DataResponse[]) => {
    if (data.length < 10) {
      setHasMore(false);
    }
    setData((prev) => prev.concat(data));
    setFormattedData((prev) => ({
      ...prev,
      rows: prev.rows.concat(createRowData(data)),
    }));
    setStart((prev) => prev + 10);
  };

  const handleSearch = (data: DataResponse[]) => {
    if (data.length < 10) {
      setHasMore(false);
    }
    setStart(10);
    setData(data);
    setFormattedData({
      rows: createRowData(data),
      columns: COLUMNS,
    });
  };

  const loadMoreRows = () => {
    fetchData(start, searchString, addRows);
  };

  useEffect(() => {
    fetchData(start, searchString, handleInitResponse);
  }, []);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasMore(true);
    setSearchString(event.target.value);
    debouncedFetch(0, event.target.value, handleSearch);
  };
  const changeFilter = (value: { id: string; name: string } | null) => {
    setFilter(value);
    if (searchString) {
      fetchData(0, '', handleInitResponse);
      setSearchString('');
      setHasMore(true);
    }
  };

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
        {...formattedData}
        onRowClick={({ ...data }) => {
          console.log(data);
        }}
        onSelectionChange={({ ...data }) => {
          console.log(data);
        }}
        fetchData={loadMoreRows}
        hasMore={hasMore}
      />
    </Container>
  );
};
export default Home;
