import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarAdmin from '../Components/Navbar-Admin'

import { API } from '../Config/Api'
import { useMutation, useQuery } from 'react-query'

export default function AddProduct() {

    const title = 'Product'
    document.title = 'DumbMerch | ' + title 

    const navigate = useNavigate()
    const api = API()

    const [preview, setPreview] = useState(null)
    const [categoryId, setCategoryId] = useState([])
    const [form, setForm] = useState({
        image: '',
        name: '',
        desc: '',
        price: '',
        qty: ''
    })

    let { data: categories, refetch } = useQuery('categoriesCache', async () => {
        const response = await api.get('/categories')
        console.log(response.data.category)
        return response.data.category
    })

    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if (checked == true) {
            setCategoryId([...categoryId, parseInt(id)])
            console.log(categoryId, parseInt(id))
        } else {
            let newCategory = categoryId.filter((categoryItem) => {
                return categoryItem != id
            })
            setCategoryId(newCategory)
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value
        })

        // Preview image and save
        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const formData = new FormData()
            formData.set('image', form?.image[0], form?.image[0]?.name)
            formData.set('name', form.name)
            formData.set('desc', form.desc)
            formData.set('price', form.price)
            formData.set('qty', form.qty)
            formData.set('categoryId', categoryId)

            const config = {
                method: 'POST',
                headers: {
                    Authorization: 'Basic ' + localStorage.token
                },
                body: formData
            }

            await api.post('/product', config)

            navigate('/product')

        } catch (error) {
            console.log(error)
        }
    })

  return (
    <div className='bg'>
        <NavbarAdmin title={title} />
        <div className='mx-5'>
            <div className='mx-5 mt-4'>
                <h3 className='mt-3'>Add Product</h3>
                <div className='mt-4'>
                    <form onSubmit={(e) => handleSubmit.mutate(e)} className='d-flex flex-column mt-4'>
                        {preview && (
                            <div>
                                <img
                                    src={preview}
                                    style={{
                                        maxWidth: '150px',
                                        maxHeight: '150px',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        )}
                        <input
                            type='file'
                            id='upload'
                            name='image'
                            hidden
                            onChange={handleChange}
                        />
                        <label htmlFor='upload' className='mt-2 mb-3 label-file upload-file'>
                            Upload file
                        </label>
                        <input
                            type='text'
                            placeholder='Product Name'
                            name='name'
                            className='add-product'
                            onChange={handleChange}
                            autoComplete='off'
                        />
                        <textarea 
                            placeholder='Product Desc'
                            name='desc'
                            onChange={handleChange}
                            className='add-product'
                            style={{height: '130px', resize: 'none'}}
                        />
                        <input
                            type='number'
                            placeholder='Price (Rp.)'
                            name='price'
                            className='add-product'
                            onChange={handleChange}
                            autoComplete='off'
                        />
                        <input
                            type='number'
                            placeholder='Stock'
                            name='qty'
                            className='add-product'
                            onChange={handleChange}
                            autoComplete='off'
                        />
                        <div className='card-category mt-2 px-3 py-1 pb-2'>
                            <div className='mb-1' style={{fontSize: '15px'}}>
                                Category
                            </div>
                            {categories?.map((item, index) => (
                                <div key={index} className='form-check form-check-inline'>
                                    <label className='me-4 form-check-label text-white'>
                                    <input
                                        type='checkbox'
                                        value={item.id}
                                        className='form-check-input'
                                        onClick={handleChangeCategoryId}
                                    />{' '}
                                    {item.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className='mt-4 mb-5'>
                            <button type='submit' className='button' style={{fontSize: '17px', background: '#56C05A', width: '100%'}}>
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
