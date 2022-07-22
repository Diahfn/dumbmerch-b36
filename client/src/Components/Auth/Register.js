import React, { useState,useContext } from 'react'
import { useMutation } from 'react-query'
import { API } from '../../Config/Api'
import { UserContext } from '../../Context/User-Context'
import '../Styles.css'

export default function Register() {

    const title = 'Register'
    document.title = 'DumbMerch | ' + title

    const [state, dispatch] = useContext(UserContext)
    const [message, setMessage] = useState(null)
    const [form, setForm] = useState({
        fullname: '',
        email: '',
        password: ''
    })

    const { email, password, fullname } = form
    const api = API()

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
                    'Content-Type': 'application/json'
                },
                body: body
            }

            const response = await api.post('/register', config)

            if (response.status === 'Success') {
                const alert = (
                    <div className='alert alert-dark py-2 fw-bold' role='alert'>
                        Register Success
                    </div>
                )
                setMessage(alert)
                setForm({
                    fullname: '',
                    email: '',
                    password: ''
                })
            } else {
                const alert = (
                    <div className='alert alert-dark py-2 fw-bold' role='alert'>
                        register Failed
                    </div>
                )
            setMessage(alert)
            }

            // dispatch({
            //     type: 'USER_SUCCESS',
            //     payload: body
            // })
        } catch (error) {
            console.log(error)
            const alert = (
                <div className='alert alert-dark py-2 fw-bold' role='alert'>
                    register Failed
                </div>
            )
            setMessage(alert)
        }
        
    })

    return (
        <div className='modal_form'>
            <h3 className=' mb-4 fw-bold'>Register</h3>
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
                {message && message}
                <div className='form-group mb-3'>
                    <input
                        className='form-control' 
                        type='text' 
                        name='fullname' 
                        placeholder='Fullname'
                        style={{backgroundColor: '#555555', border: '2px solid #BCBCBC', color: 'white'}}
                        onChange={handleChange}
                        value={fullname}
                        autoComplete='off'                                        
                    />
                </div>
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
                <div className='d-grid'>
                    <button type='submit'
                        style={{backgroundColor: '#F74D4D',width: '100%', color:'white'}} 
                        className='button mt-3 fw-bold'>
                            Register
                    </button>
                </div>
            </form>
        </div>
    )
}
