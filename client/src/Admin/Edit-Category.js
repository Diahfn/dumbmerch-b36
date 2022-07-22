import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import NavbarAdmin from '../Components/Navbar-Admin'
import { API } from '../Config/Api'

export default function EditCategory() {

    const title = 'Category'
    document.title = 'DumbMerch | ' + title

    let { id } = useParams()
    const navigate = useNavigate()
    const api = API()

    const [category, setCategory] = useState({ name: '' })

    let { refetch } = useQuery('categoriesCache', async () => {
        const response = await api.get('/category/' + id)
        // console.log(response.data.name)
        setCategory({ name: response.data })
    })

    const handleChange = (e) => {
        setCategory({
            ...category,
            name: e.target.value
        })
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const body = JSON.stringify(category)

            const config = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            }

            await api.patch('/category/' + id, config)

            navigate('/category')
        } catch (error) {
            console.log(error)
        }
    })

    return (
        <div className='bg'>
            <NavbarAdmin title={title} />
            <div className='mt-4 mx-5'>
                <h3 style={{marginLeft: '70px', marginTop: '50px'}}>Edit Category</h3>
                <div className='mx-5'>
                    <form onSubmit={(e) => handleSubmit.mutate(e)} className='d-flex flex-column mt-5'>
                        <input className='input-category' 
                        placeholder='Category' 
                        onChange={handleChange}
                        value={category.name} />
                        <button className='btn-category' type='submit'>Save</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
