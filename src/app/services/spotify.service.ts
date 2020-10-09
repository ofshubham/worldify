import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { countryList } from "./countryList";

@Injectable({
  providedIn: "root",
})
export class SpotifyService {
  CLIENT_ID = "2b09c6e30b4c4cc1acb5353c9a62ddab";

  uriRefreshToken = "https://accounts.spotify.com/api/token";

  uriGetFeaturedPlaylists =
    "https://api.spotify.com/v1/browse/featured-playlists?limit=20&country=";
  uriGetNewReleased = "https://api.spotify.com/v1/browse/new-releases";
  uriGetGenres = "https://api.spotify.com/v1/browse/categories";
  uriGetUserDetails = "https://api.spotify.com/v1/me";

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem("token");
  }

  public isAuthenticated() {
    return this.getToken();
  }

  retrieveToken(origin) {
    localStorage.removeItem("token");
    const scopes = "user-read-private";
    window.location.href =
      "https://accounts.spotify.com/authorize/?" +
      "client_id=" +
      this.CLIENT_ID +
      "&response_type=token" +
      "&redirect_uri=" +
      origin +
      "/callback/" +
      "&scope=" +
      scopes;
  }

  getFeaturedPlaylists(country) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      `Bearer ${this.isAuthenticated()}`
    );
    return this.http.get<any>(this.uriGetFeaturedPlaylists + country, {
      headers: headers,
    });
  }

  getNewReleased(country, offset) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      `Bearer ${this.isAuthenticated()}`
    );
    return this.http.get<any>(
      this.uriGetNewReleased +
        "?country=" +
        country +
        "&limit=50" +
        "&offset=" +
        (offset + 50),
      { headers: headers }
    );
  }

  getGenres(country) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      `Bearer ${this.isAuthenticated()}`
    );
    return this.http.get<any>(
      this.uriGetGenres +
        "?country=" +
        country +
        "&limit=50" +
        "&locale=" +
        this.getLocale(country),
      { headers: headers }
    );
  }

  getPlaylistsById(id, country) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      `Bearer ${this.isAuthenticated()}`
    );
    return this.http.get<any>(
      this.uriGetGenres +
        "/" +
        id +
        "/playlists" +
        "?country=" +
        country +
        "&limit=50",
      { headers: headers }
    );
  }

  getLocale(country) {
    let countryObj = countryList.find((obj) => obj.code == country);
    return countryObj.locale || "us_EN";
  }

  getUserInfo() {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      `Bearer ${this.isAuthenticated()}`
    );
    return this.http.get<any>(this.uriGetUserDetails + "/", {
      headers: headers,
    });
  }

  logout() {
    localStorage.removeItem("token");
  }
}
