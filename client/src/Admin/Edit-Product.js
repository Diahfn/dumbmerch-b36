import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../Components/Navbar-Admin'
import { useNavigate, useParams } from 'react-router-dom'
import { API } from '../Config/Api'
import { useMutation, useQuery } from 'react-query'
import Checkbox from '../Components/form/Checkbox'

export default function EditProduct() {

    const title = 'Product'
    document.title = 'DumbMerch | ' + title

    const navigate = useNavigate()
    const api = API()
    const { id } = useParams()

    const [preview, setPreview] = useState(null)
    const [categoryId, setCategoryId] = useState([])
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState({})
    const [form, setForm] = useState({
        image: '',
        name: '',
        desc: '',
        price: '',
        qty: ''
    })

    let { productRefetch } = useQuery('productCache', async () => {
        const config = {
            headers: {
                Authorization: 'Basic ' + localStorage.token
            }
        }

        const response = await api.get('/product/' + id, config)
        setForm({
            name: response.data.product.name,
            desc: response.data.product.desc,
            price: response.data.product.price,
            qty: response.data.product.qty,
            image: response.data.product.image
        })
        setProduct(response.data.product)
    })

    let { categoriesRefetch } = useQuery('categoriesCache', async () => {
        const response = await api.get('/categories')
        setCategories(response.data.category)
    })

    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if (checked) {
            setCategoryId([...categoryId, parseInt(id)])
            console.log(Object[categoryId])
        } else {
            let newCategoryId = categoryId.filter((categoryItem) => {
                return categoryItem != id
            })
            setCategoryId(newCategoryId)
            console.log(newCategoryId)
        }
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === 'file' ? e.target.files : e.target.value
        })

        if (e.target.type === 'file') {
            setPreview(e.target.files)
        }
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const formData = new FormData()
            if (preview) {
                formData.set('image', preview[0], preview[0]?.name)
            }
            formData.set('name', form.name)
            formData.set('desc', form.desc)
            formData.set('price', form.price)
            formData.set('qty', form.qty)
            formData.set('categoryId', categoryId)
            
            const config = {
                method: 'PATCH',
                headers: {
                    Authorization: 'Basic ' + localStorage.token
                },
                body: formData
            }

            const response = await api.patch('/product/' + product.id, config)
            console.log(response)
            navigate('/product')
        } catch (error) {
            console.log(error)
        }
    })

    useEffect(() => {
        const newCategoryId = product?.categories?.map((item) => {
            return item.id
        })
        setCategoryId(newCategoryId)
    }, [product])

    return (
        <div className='bg'>
            <NavbarAdmin title={title}/>
            <div className='mx-5'>
                <div className='mx-5 mt-4'>
                    <h3 className='mt-3'>Edit Product</h3>
                    <div className='mt-4'>
                        <form onSubmit={(e) => handleSubmit.mutate(e)} className='d-flex flex-column mt-4'>
                            {!preview ? (
                                <div>
                                    <img
                                        src={form.image}
                                        style={{
                                            maxWidth: '150px',
                                            maxHeight: '150px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <img
                                        src={URL.createObjectURL(preview[0])}
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
                                value={form.name}
                                autoComplete='off'
                            />
                            <textarea 
                                placeholder='Product Desc'
                                name='desc'
                                onChange={handleChange}
                                value={form.desc}
                                className='add-product'
                                style={{height: '130px', resize: 'none'}}
                            />
                            <input
                                type='number'
                                placeholder='Price (Rp.)'
                                name='price'
                                className='add-product'
                                onChange={handleChange}
                                value={form.price}
                                autoComplete='off'
                            />
                            <input
                                type='number'
                                placeholder='Stock'
                                name='qty'
                                className='add-product'
                                onChange={handleChange}
                                value={form.qty}
                                autoComplete='off'
                            />
                            <div className='card-category mt-2 px-3 py-1 pb-2'>
                                <div className='mb-1' style={{fontSize: '15px'}}>
                                    Category
                                </div>
                                {product &&
                                    categories.map((item, index) => (
                                    <div key={index} className='form-check form-check-inline'>
                                        <label className='me-4 form-check-label text-white'>
                                            <Checkbox
                                                categoryId={categoryId}
                                                value={item.id}
                                                handleChangeCategoryId={handleChangeCategoryId}
                                            />
                                            {/* <input
                                            type='checkbox'
                                            value={item.id}
                                            onClick={handleChangeCategoryId}
                                            className='form-check-input'
                                        /> */}
                                        <span className='ms-2'>{item.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className='mt-4 mb-5'>
                                <button type='submit' className='button' style={{fontSize: '17px', background: '#56C05A', width: '100%'}}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
