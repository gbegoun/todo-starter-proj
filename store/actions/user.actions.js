import { userService } from "../../services/user.service.js"
import { SET_USER, SET_USER_BALANCE, UPDATE_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function login(credentials) {
    return userService.login(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}


export function signup(credentials) {
    return userService.signup(credentials)
        .then(user => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch(err => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}

export function setBalance(userId, balance) {    
    return userService.setUserBalance(userId, balance)
            .then(() => store.dispatch({ type: SET_USER_BALANCE, balance }))
            .catch(err => {
                store.dispatch({ type: UNDO_BALANCE })
                console.log('Cannot change balance', err)
                throw err
            })
}

export function updateUser(user) {
    const prev_user = {...store.getState().userModule.loggedInUser}
    return userService.updateUser(user)
            .then(() => store.dispatch({ type: UPDATE_USER, user }))
            .catch(err => {
                store.dispatch({ type: UPDATE_USER, prev_user })
                console.log('Cannot update user', err)
                throw err
            })
}

export function logout() {
    return userService.logout()
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
            // document.body.style.backgroundColor = '#ffffff';
            // document.body.style.color = '#000000';

        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
            throw err
        })
}