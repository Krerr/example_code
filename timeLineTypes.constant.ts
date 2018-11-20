// Пример файла констант, которые хранят константные данные и могут предоставлять их приложению в разной форме
import { I18n } from "react-redux-i18n";

export enum timelineDisplayOptionTypes {
    CURRENT_DAY = "CURRENT_DAY",
    CURRENT_MONTH = "CURRENT_MONTH",
    ANY_DAY = "ANY_DAY",
    ANY_PERIOD = "ANY_PERIOD",
}

export const timelineDisplayOption = () => {
    const L = new Map<string, { codeName: string; title: string }>();
    const dict = "myData.layerForm.displayOptions";

    L.set(timelineDisplayOptionTypes.CURRENT_DAY, {
        codeName: timelineDisplayOptionTypes.CURRENT_DAY,
        title: I18n.t(`${dict}.currentDay`),
    });

    L.set(timelineDisplayOptionTypes.CURRENT_MONTH, {
        codeName: timelineDisplayOptionTypes.CURRENT_MONTH,
        title: I18n.t(`${dict}.currentMonth`),
    });

    L.set(timelineDisplayOptionTypes.ANY_DAY, {
        codeName: timelineDisplayOptionTypes.ANY_DAY,
        title: I18n.t(`${dict}.anyDay`),
    });

    L.set(timelineDisplayOptionTypes.ANY_PERIOD, {
        codeName: timelineDisplayOptionTypes.ANY_PERIOD,
        title: I18n.t(`${dict}.anyPeriod`),
    });

    return L;
};
