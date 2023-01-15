import { makeAutoObservable } from 'mobx'
export default class Store {
    constructor() {
        this._auth = false;
        makeAutoObservable(this)
    }
    setAuth(bool) {
        this._auth = bool;
    }
    get auth() {
        return this._auth;
    }
}