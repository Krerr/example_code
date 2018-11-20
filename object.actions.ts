// Пример файла с redux-actions

import { Action } from "../../common/model/Action.model";
import { ActionTypes } from "../../common/constants/ActionTypes";
import { Pagination } from "../../common/model/pagination/Pagination.model";
import { ObjectPagination } from "../../common/model/pagination/ObjectPagination.model";


export type OBJECTS_LOAD = null;
export const loadObjects = (): Action<OBJECTS_LOAD> => ({
    type: ActionTypes.OBJECTS_LOAD,
    payload: null,
});

export type OBJECTS_LOADED = ObjectPagination;
export const objectsLoaded = (pagination: ObjectPagination): Action<OBJECTS_LOADED> => ({
    type: ActionTypes.OBJECTS_LOADED,
    payload: pagination,
});

export type OBJECTS_SET_PAGE = number;
export const setPage = (page: number): Action<OBJECTS_SET_PAGE> => ({
    type: ActionTypes.OBJECTS_SET_PAGE,
    payload: page,
});