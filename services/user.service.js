import { storageService } from "./async-storage.service.js"


export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    setUserBalance,
    updateUser,
}
const STORAGE_KEY_LOGGEDIN = 'user'
const STORAGE_KEY = 'userDB'

function query() {
    return storageService.query(STORAGE_KEY)
}

function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

function login({ username, password }) {
    return storageService.query(STORAGE_KEY)
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname }) {
    const user = { username, password, fullname,balance:0,activities:[] }
    user.createdAt = user.updatedAt = Date.now()

    return storageService.post(STORAGE_KEY, user)
        .then(_setLoggedinUser)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function setUserBalance(userId, balance){
    return storageService.get(STORAGE_KEY, userId)
    .then(user => {
        user.balance = balance
        return storageService.put(STORAGE_KEY, user)
    })
    .then(updatedUser=> {
        const loggedInUser = getLoggedinUser()
        if(loggedInUser && loggedInUser._id === userId) _setLoggedinUser(updatedUser)
    })
}

function updateUser(user) {

    return storageService.put(STORAGE_KEY, user)
        .then(_setLoggedinUser)
} 

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname, balance: user.balance, color: user.color, backgroundColor: user.backgroundColor }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    document.body.style.color = user.color || '#000000';
    document.body.style.backgroundColor = user.backgroundColor || '#ffffff';

    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: 'Admin',
        username: 'admin',
        password: 'admin',
    }
}

export function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}