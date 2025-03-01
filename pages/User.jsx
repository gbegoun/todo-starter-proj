const { useSelector, useDispatch } = ReactRedux
const { useState, useEffect } = React

import { LoginSignup } from '../cmps/LoginSignup.jsx'
import { updateUser } from '../store/actions/user.actions.js'

export function User() {


    const user = useSelector(storeState => storeState.userModule.loggedInUser)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState(user || { fullname: '', color: '#000000', backgroundColor: '#ffffff' });

    useEffect(() => {
        if (user) {
            document.body.style.color = formData.color || '#000000';
            document.body.style.backgroundColor = formData.backgroundColor || '#ffffff';
        }
        return () => {
            document.body.style.color = user && user.color || '#000000';
            document.body.style.backgroundColor = user && user.backgroundColor || '#ffffff';
        }
        
    }, [formData, user]);

    function onSetUser(user) {
        dispatch({ type: 'SET_USER', user })
    }

    function handleChange (ev) {     
        const { name, value } = ev.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleSave() {
        updateUser(formData)
    }

    if (!user) {
        return (
            <section className="user">
                <LoginSignup onSetUser={onSetUser} />
            </section>
        )
    }
    return (
        <section className="user">
            <form>
                <label>
                    Name:
                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
                </label>
                <label>
                    Color:
                    <input type="color" name="color" value={formData.color || '#000000'} onChange={handleChange} />
                </label>
                <label>
                    Background Color:
                    <input type="color" name="backgroundColor" value={formData.backgroundColor || '#ffffff'} onChange={handleChange} />
                </label>
                <button type="button" onClick={handleSave}>Save</button>
            </form>
        </section>
    )

}