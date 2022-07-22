import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarAdmin from '../Components/Navbar-Admin'
import DeleteModal from '../Components/Modal/Delete-Modal'
import rupiahFormat from 'rupiah-format'
import { API } from '../Config/Api'
import { useMutation, useQuery } from 'react-query'

export default function Product() {

    const title = 'Product'
    document.title = 'DumbMerch | ' + title

    const [idDelete, setIdDelete] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const navigate = useNavigate()
    const api = API()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    let { data: products, refetch } = useQuery('productsCache', async () => {
        const config = {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + localStorage.token
            }
        }
        const response = await api.get('/products', config)
        return response.data.product
    })

    const handleEdit = (id) => {
        navigate(`/edit-product/${id}`)
    }

    const handleDelete = (id) => {
        setIdDelete(id)
        handleShow()
    }

    const deleteById = useMutation(async (id) => {
        try {
            const config = {
                method: 'DELETE',
                headers: {
                    Authorization: 'Basic ' + localStorage.token
                }
            }
            await api.delete(`/product/${id}`, config)
            refetch()

        } catch (error) {
            console.log(error)
        }
    })

    useEffect(() => {
        if (confirmDelete) {
            handleClose()

            deleteById.mutate(idDelete)
            setConfirmDelete(null)
        }
    }, [confirmDelete])

    const addProduct = () => {
        navigate('/add-product')
    }

    return (
        <div className='bg'>
            <NavbarAdmin title={title} />
            <div className='d-flex justify-content-center mx-5'>
                <div className='mx-5'>
                    <div className='d-flex justify-content-between mb-3 mt-5'>
                        <h3 className='fw-bold'>List Product</h3>
                        <button onClick={addProduct} style={{background: '#56C05A'}} className='button'>
                            Add
                        </button>
                    </div>
                    <div>
                        {products?.length != 0 ? (
                            <table className='table my-3 table-dark table-striped'>
                                <thead>
                                    <tr style={{fontSize: '17px'}}>
                                        <th>No</th>
                                        <th>Photo</th>
                                        <th>Product Name</th>
                                        <th>Product Desc</th>
                                        <th>Price</th>
                                        <th>Qty</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <img
                                                    src={item.image}
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                </td>
                                            <td>{item.name}</td>
                                            <td className='text-truncate' style={{maxWidth:  '210px'}}>{item.desc}</td> 
                                            <td>{rupiahFormat.convert(item.price)}</td>
                                            <td>{item.qty}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleEdit(item.id)}
                                                    className='button mx-2' 
                                                    style={{background: '#56C05A'}}
                                                >Edit</button>
                                                <button 
                                                    onClick={() => handleDelete(item.id)} 
                                                    className='button mx-2'
                                                    style={{background: '#F74D4D'}}
                                                >Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>
                                <div className='mt-3'>No Data category</div>
                            </div>
                        )}
                    </div>
                </div>
                <DeleteModal
                    setConfirmDelete={setConfirmDelete}
                    show={show}
                    handleClose={handleClose}
                />
            </div>
        </div>
    )
}
