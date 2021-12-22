export interface EmploiCritereRecherche {
    dateAdded?: Date,
    libelle?: string,
    technicalParameters?: {
        page?: Number,
        per_page?: any,
        sort?: Number
    },
    criterias?: {
        contractTypeCode?: string[],
        contractNatureCode?: string[],
        romeProfessionCardCode?: string[],
        largeAreaCode?: string[],
        delaySinceCreation?: string,
        keywords?: string,
        cityCode?: string,
        cityDistance?: number,
        departmentCode?: string[],
        includeDepartementBoundaries?: number,
        regionCode?: string,
        countryCode?: string
    }
}
