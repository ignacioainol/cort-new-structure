import { REGIONS_LIST_FAIL, REGIONS_LIST_REQUEST, REGIONS_LIST_SUCCESS } from "../constants/regionConstants";
import axios from 'axios';

const listRegions = () => async (dispatch) => {
    try {
        dispatch({ type: REGIONS_LIST_REQUEST });
        const { data } = await axios.get(`regions`);
        dispatch({ type: REGIONS_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: REGIONS_LIST_FAIL, payload: error.message });
    }
}

export { listRegions }