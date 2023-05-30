import { useState } from 'react';
import { motion } from 'framer-motion';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons-material/Close';

import {
  AIRING_TABLE_AIRING_ID_FILTER,
  AIRING_TABLE_ITEM_NAME_FILTER,
  AIRING_TABLE_ITEM_NUMBER_FILTER,
  AIRING_TABLE_PRICE_FILTER,
  AIRING_TABLE_PRICE_OVER_UNDER_FILTER,
  AIRING_TABLE_SHOW_FILTER,
  AIRING_TABLE_STATION_FILTER,
} from '../../constants';
import { useAppDispatch } from '../../config/hooks';
import { filterTableAirings } from '../../actions/airings';

interface TableFilterMenuProps {
  handleClose: () => void;
}

function TableFilterMenu({ handleClose }: TableFilterMenuProps): JSX.Element {
  const dispatch = useAppDispatch();
  const defaultPriceFilter = localStorage.getItem(AIRING_TABLE_PRICE_FILTER);
  const defaultStationFilter = localStorage.getItem(
    AIRING_TABLE_STATION_FILTER
  );
  const defaultShowFilter = localStorage.getItem(AIRING_TABLE_SHOW_FILTER);
  const defaultItemNumberFilter = localStorage.getItem(
    AIRING_TABLE_ITEM_NUMBER_FILTER
  );
  const defaultAiringIdFilter = localStorage.getItem(
    AIRING_TABLE_AIRING_ID_FILTER
  );
  const defaultItemNameFilter = localStorage.getItem(
    AIRING_TABLE_ITEM_NAME_FILTER
  );
  const defaultPriceOverUnderFilter = localStorage.getItem(
    AIRING_TABLE_PRICE_OVER_UNDER_FILTER
  );
  const [stationFilter, setStationFilter] = useState<string>(
    defaultStationFilter ?? ''
  );
  const [showFilter, setShowFilter] = useState<string>(defaultShowFilter ?? '');
  const [airingIdFilter, setAiringIdFilter] = useState<string>(
    defaultAiringIdFilter ?? ''
  );
  const [itemNameFilter, setItemNameFilter] = useState<string>(
    defaultItemNameFilter ?? ''
  );
  const [itemNumberFilter, setItemNumberFilter] = useState<string>(
    defaultItemNumberFilter ?? ''
  );
  const [priceFilter, setPriceFilter] = useState<string>(
    defaultPriceFilter ?? ''
  );
  const [priceOverUnderFilter, setPriceOverUnderFilter] = useState<string>(
    defaultPriceOverUnderFilter ?? ''
  );
  const handleStationInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setStationFilter(e.target.value);
  };
  const handleShowInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setShowFilter(e.target.value);
  };
  const handleAiringIdInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAiringIdFilter(e.target.value);
  };
  const handleItemNameInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setItemNameFilter(e.target.value);
  };
  const handleItemNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setItemNumberFilter(e.target.value);
  };
  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPriceFilter(e.target.value);
  };
  const handlePriceOverUnderInput = (e: SelectChangeEvent<string>): void => {
    setPriceOverUnderFilter(e.target.value);
  };
  const applyFilters = async (): Promise<void> => {
    let searchParams = '';
    if (itemNameFilter.length > 0) {
      localStorage.setItem(AIRING_TABLE_ITEM_NAME_FILTER, itemNameFilter);
      searchParams += '&item_name=' + itemNameFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_ITEM_NAME_FILTER);
    }
    if (itemNumberFilter.length > 0) {
      localStorage.setItem(AIRING_TABLE_ITEM_NUMBER_FILTER, itemNumberFilter);
      searchParams += '&item_number=' + itemNumberFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_ITEM_NUMBER_FILTER);
    }
    if (airingIdFilter.length > 0) {
      localStorage.setItem(AIRING_TABLE_AIRING_ID_FILTER, airingIdFilter);
      searchParams += '&airing_id=' + airingIdFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_AIRING_ID_FILTER);
    }
    if (showFilter.length > 0) {
      localStorage.setItem(AIRING_TABLE_SHOW_FILTER, showFilter);
      searchParams += '&show=' + showFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_SHOW_FILTER);
    }
    if (stationFilter.length > 0) {
      localStorage.setItem(AIRING_TABLE_STATION_FILTER, stationFilter);
      searchParams += '&station=' + stationFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_STATION_FILTER);
    }
    if (
      priceFilter !== defaultPriceFilter &&
      priceFilter !== '' &&
      priceFilter !== '0'
    ) {
      localStorage.setItem(AIRING_TABLE_PRICE_FILTER, priceFilter);
      if (priceOverUnderFilter === 'under') {
        searchParams += '&under=false';
      }
      searchParams += '&price=' + priceFilter;
    } else {
      localStorage.removeItem(AIRING_TABLE_PRICE_FILTER);
    }
    await dispatch(filterTableAirings(searchParams));
  };
  const handleApplyConfirm = (): void => {
    void applyFilters();
    handleClose();
  };
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="table-filter-menu__container"
    >
      <IconButton onClick={handleClose}>
        <CloseIcon htmlColor="black" />
      </IconButton>
      <header>Filter Airings</header>
      <form className="table-filter-menu__form">
        <TextField
          label="Item Name"
          value={itemNameFilter}
          variant="standard"
          onChange={handleItemNameInput}
          sx={{ flex: '100%' }}
        />
        <TextField
          label="Item Number"
          value={itemNumberFilter}
          variant="standard"
          onChange={handleItemNumberInput}
        />
        <TextField
          label="Airing ID"
          value={airingIdFilter}
          variant="standard"
          onChange={handleAiringIdInput}
        />
        <TextField
          label="Show"
          value={showFilter}
          variant="standard"
          onChange={handleShowInput}
        />
        <TextField
          label="Station"
          value={stationFilter}
          variant="standard"
          onChange={handleStationInput}
        />
        <div className="price__text-field">
          <FormControl>
            <InputLabel>Under Or Over</InputLabel>
            <Select
              value={priceOverUnderFilter}
              label="Over or Under"
              onChange={handlePriceOverUnderInput}
            >
              <MenuItem value="over">Over</MenuItem>
              <MenuItem value="under">Under</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Price"
            value={priceFilter}
            variant="standard"
            onChange={handlePriceInput}
          />
        </div>
      </form>
      <Button
        onClick={handleApplyConfirm}
        variant="contained"
        color="success"
        sx={{ marginLeft: '10px' }}
      >
        Apply Filters
      </Button>
    </motion.div>
  );
}

export default TableFilterMenu;
