import React, { useState } from 'react'
import NavbarAdmin from '../Components/Navbar-Admin'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { API } from '../Config/Api'

export default function AddCategory() {

    const title = 'Category'
    document.title = 'DumbMerch | ' + title

    const api = API()
    const navigate = useNavigate()
    const [category, setCategory] = useState('')

    const handleChange = (e) => {
        setCategory(e.target.value)
    }

    const handleSubmit = useMutation(async (e) => {
        try {

            e.preventDefault()

            const body = JSON.stringify({name: category})

            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            }

            const response = await api.post('/category', config)

            navigate('/category')
            
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <div className='bg'>
            <NavbarAdmin title={title} />
            <div>
                <div className='mt-4 mx-5'>
                    <h3 style={{marginLeft: '70px', marginTop: '50px'}}>Add Category</h3>
                    <div className='mx-5'>
                        <form className='d-flex flex-column form mt-5' onSubmit={(e) => handleSubmit.mutate(e)}>
                            <input className='input-category' placeholder='Category' name='category' onChange={handleChange} value={category} autoComplete='off' />
                            <button className='btn-category' type='submit'>Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
