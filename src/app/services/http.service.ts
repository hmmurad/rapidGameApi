import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { APIResponse, Game } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set('ordering', ordering);
    if (search) {
      params = new HttpParams().set('ordering', ordering).set('search', search);
    }

    return this.http.get<APIResponse<Game>>(`${env.APIUrl}/games`, {
      params: params,
    });
  }

  getGame(id: string): Observable<Game> {
    const getGameInfo = this.http.get(`${env.APIUrl}/games/${id}`);
    const gameTrailer = this.http.get(`${env.APIUrl}/games/${id}/movies`);
    const gameScreenshots = this.http.get(
      `${env.APIUrl}/games/${id}/screenshots`
    );

    return forkJoin({
      getGameInfo,
      gameTrailer,
      gameScreenshots,
    }).pipe(
      map((res: any) => {
        return {
          ...res['getGameInfo'],
          screenshots: res['gameScreenshots']?.results,
          trailers: res['gameTrailer']?.results,
        };
      })
    );
  }
}
