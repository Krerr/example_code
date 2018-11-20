// Пример простейший файла обработки сайд эффектов через redux-saga

export function* loadObjects(action: Action<OBJECTS_LOAD>) {
    try {
        yield put(showGlobalLoader());

        const pagination = yield select(objectsSelector);
        const regCodeName = yield select(currentRegisterSelector);
        const filter = pagination.paramsObj;
        filter.fields = [...new Set([...filter.fields, ...filter.calculatorsUsedFields])];
        filter.formatCalculators();
        const res: any = yield call(getObjectsApi, regCodeName, pagination.model.get("codeName"), filter.asMap);
        pagination.deserializeResult(res);

        yield put(objectsLoaded(pagination));
        yield put(setCurrentFilter(filter));
    } catch (e) {
        yield put(addErrorNotification(e.message));
    } finally {
        yield put(hideGlobalLoader());
    }
}


export const saga = function* saga() {
    yield takeEvery(ActionTypes.OBJECTS_LOAD, loadObjects);

};
