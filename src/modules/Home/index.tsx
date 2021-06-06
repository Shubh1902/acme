import { Box, Container, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import InfiniteTable, {
  TableColumnsInterface,
  TableRowsInterface,
} from 'src/components/InfiniteTable';
import Navbar from 'src/components/Navbar';
import { FILTER_OPTIONS } from 'src/modules/Home/constants';
import { createData } from 'src/modules/Home/helper';
import FuzzySearch from 'fuzzy-search';

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
    columns: [],
  });
  const [searchString, setSearchString] = useState<string>('');
  const [filter, setFilter] =
    useState<null | { id: string; name: string }>(null);
  const loadData = () => {
    fetchData(offset)
      .then((res) => handleResponse(res))
      .catch((e) => console.log(e));
  };

  useEffect(()=>{

  },[originalData])

  const searchData = (searchString: string) => {
    if(!searchString){

    }
    const searcher = new FuzzySearch(originalData, ['title'], {
      caseSensitive: false,
    });
    const result = searcher.search(searchString);
    console.log(result);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newString = event.target.value;
    setSearchString(newString);
    searchData(newString);
  };
  const changeFilter = (value: { id: string; name: string } | null) => {
    setFilter(value);
  };
  const handleResponse = (res: DataResponse[]) => {
    setOriginalData((prev) => prev.concat(res));
    setFormattedData((prev) => {
      const formattedData = createData(res);
      return {
        columns: prev.columns.length ? prev.columns : formattedData.columns,
        rows: prev.rows.concat(formattedData.rows),
      };
    });
    setOffset((prev) => prev + 1);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container className="container">
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
          placeholder={
            filter ? `Enter ${filter.name}` : `Select Filter to search`
          }
        ></Autocomplete>
        <TextField
          id="search"
          label={filter ? `Search` : `Select Filter to Search`}
          fullWidth
          onChange={handleChange}
          value={searchString}
          placeholder={
            filter ? `Enter ${filter.name}` : `Select Filter to search`
          }
          disabled={!filter}
        />
      </Box>

      <InfiniteTable
        {...formattedData}
        onRowClick={() => {}}
        onSelectionChange={() => {}}
        fetchData={loadData}
      />
    </Container>
  );
};
export default Home;
