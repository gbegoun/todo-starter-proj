const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector, useDispatch } = ReactRedux

// import { userService }  from '../services/user.service.js'
import { logout } from '../store/actions/user.actions.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { LoginSignup }  from './LoginSignup.jsx'
import { UserMsg }      from "./UserMsg.jsx"
import { setBalance } from '../store/actions/user.actions.js'
export function AppHeader() {

    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    

    const navigate = useNavigate()
    const dispatch = useDispatch()

    function onLogout() {
        console.log("LOGOUT")
        logout()
            .then(() => {
                showSuccessMsg('Logout successfully')
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function onSetUser(user) {
        dispatch({ type: 'SET_USER', user })
    }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                {user ? (
                    < section >
                        <Link to={`/user/${user._id}`}>Hello {user.fullname}, your balance is {user.balance}</Link>
                        <button onClick={onLogout}>Logout</button>
                    </ section >
                ) : (
                    <section>
                        <LoginSignup onSetUser={onSetUser} />
                    </section>
                )}
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
