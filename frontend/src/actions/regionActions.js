import {
    REGIONS_LIST_FAIL,
    REGIONS_LIST_REQUEST,
    REGIONS_LIST_SUCCESS,
    COMMUNE_BY_REGIONID_LIST_REQUEST,
    COMMUNE_BY_REGIONID_LIST_SUCCESS,
    COMMUNE_BY_REGIONID_LIST_FAIL
} from "../constants/regionConstants";

import axios from 'axios';

const listRegions = () => async (dispatch) => {
    try {
        dispatch({ type: REGIONS_LIST_REQUEST });
        const { data } = await axios.get(`api/regions`);
        dispatch({ type: REGIONS_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: REGIONS_LIST_FAIL, payload: error.message });
    }
}

const getTownsByIdRegion = (idRegion) => async (dispatch) => {
    try {

    } catch (error) {
        // dispatch()
    }
}

export { listRegions }