import { Injectable } from '@nestjs/common';

@Injectable()
export class ClubDataService {
  private queryParams(): string {
    const queryParams = new Map<string, any>();
    queryParams.set('where', 'objectid+is+not+null');
    queryParams.set('text', '');
    queryParams.set('objectIds', '');
    queryParams.set('time', '');
    queryParams.set('geometry', '');
    queryParams.set('geometryType', 'esriGeometryEnvelope');
    queryParams.set('inSR', '');
    queryParams.set('spatialRel', 'esriSpatialRelIntersects');
    queryParams.set('distance', '');
    queryParams.set('units', 'esriSRUnit_Foot');
    queryParams.set('relationParam', '');
    queryParams.set('outFields', '*');
    queryParams.set('returnGeometry', true);
    queryParams.set('returnTrueCurves', false);
    queryParams.set('maxAllowableOffset', '');
    queryParams.set('geometryPrecision', '');
    queryParams.set('outSR', 4326);
    queryParams.set('havingClause', '');
    queryParams.set('returnIdsOnly', false);
    queryParams.set('returnCountOnly', false);
    queryParams.set('orderByFields', '');
    queryParams.set('groupByFieldsForStatistics', '');
    queryParams.set('outStatistics', '');
    queryParams.set('returnZ', false);
    queryParams.set('returnM', false);
    queryParams.set('gdbVersion', '');
    queryParams.set('historicMoment', '');
    queryParams.set('returnDistinctValues', false);
    queryParams.set('resultOffset', '');
    queryParams.set('resultRecordCount', '');
    queryParams.set('returnExtentOnly', false);
    queryParams.set('datumTransformation', '');
    queryParams.set('parameterValues', '');
    queryParams.set('rangeValues', '');
    queryParams.set('quantizationParameters', '');
    queryParams.set('featureEncoding', 'esriDefault');
    queryParams.set('f', 'pjson');

    let queryString = '';
    queryParams.forEach((value, key) => {
      queryString += `${key}=${value}&`;
    });

    return queryString;
  }

  getClubData(): Promise<any> {
    const queryParams = this.queryParams();

    const data = fetch(
      'https://geoportal.stadt-koeln.de/arcgis/rest/services/kultur/clubkataster/MapServer/0/query?' +
        queryParams,
    );

    
  }
}
