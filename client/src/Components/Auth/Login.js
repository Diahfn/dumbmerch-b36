import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/User-Context'
import '../Styles.css'

import { API } from '../../Config/Api'
import { useMutation } from 'react-query'

export default function Login() {

    const title = 'Login'
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()
    const api = API()

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const { email, password } = form

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const body = JSON.stringify(form)

            const config = {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: body
            }

            const response = await api.post('/login', config)
            console.log(response.message)

            if (response.status === 'Success') {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: response.data
                })

                if (state.user.status === 'admin') {
                    navigate('/admin-complain')
                } else {
                    navigate('/homepage')
                }

                const alert = (
                    <div className='alert alert-dark py-2 fw-bold' role='alert'>
                        Login Success
                    </div>
                )
                setMessage(alert)
            } else {
                const alert = (
                    <div className='alert alert-danger py-2 fw-bold' role='alert'>
                        Email or password are not match
                    </div>
                )
                setMessage(alert)
            }
        } catch (error) {
            console.log(error)
            const alert = (
                <div className='alert alert-danger py-2 fw-bold' role='alert'>
                    User not Found
                </div>
            )
            setMessage(alert)
        }
    })

    return (
        <div className='modal_form'>
            <h3 className=' mb-4 fw-bold'>Login</h3>
            
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                {message && message}
                <div className='form-group mb-3'>
                    <input
                        className='form-control' 
                        type='email' 
                        name='email' 
                        placeholder='Email'
                        style={{backgroundColor: '#555555', border: '2px solid #BCBCBC', color: 'white'}}
                        onChange={handleChange}
                        value={email}
                        autoComplete='off'                                        
                    />
                </div>
                <div className='form-group mb-4'>
                    <input
                        className='form-control' 
                        type='password' 
                        name='password' 
                        placeholder='Password'
                        style={{backgroundColor: '#555555', border: '2px solid #BCBCBC', color: 'white'}}
                        onChange={handleChange}
                        value={password}
                        autoComplete='off'                                        
                    />
                </div>
                <div>
                    <button 
                        style={{backgroundColor: '#F74D4D',width: '100%', color:'white'}} 
                        className='button mt-3 fw-bold'>
                            Login 
                    </button>
                </div>
            </form>
        </div>
    )
}
