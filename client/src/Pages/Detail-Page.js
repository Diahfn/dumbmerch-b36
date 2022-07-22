import React, { useEffect, useState } from 'react'
import NavBar from '../Components/NavBar'
import { useNavigate, useParams } from  'react-router-dom'
import convertRupiah from 'rupiah-format'
import { API } from '../Config/Api'
import { useMutation, useQuery } from 'react-query'

export default function DetailPage() {

    let { id } = useParams()
    const api = API()
    const navigate = useNavigate()

    const title = 'Product'
    document.title = 'DumbMerch | ' + title

    let { data: product, refetch } = useQuery('Cache', async () => {
        const config = {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + localStorage.token
            }
        }
        const response = await api.get('/product/' + id, config)
        return response.data.product
    })

    useEffect(() => {
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'

        const myMidtransClientKey = 'Client key here ...'

        let scriptTag = document.createElement('script')
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute('data-client-key', myMidtransClientKey)

        document.body.appendChild(scriptTag)
        return () => {
        document.body.removeChild(scriptTag)
        };
    }, [])

    const buyProduct = useMutation(async () => {
        try {
            const data = {
                idProduct: product.id,
                idSeller: product.user.id,
                price: product.price
            }
            console.log(data)

            const body = JSON.stringify(data)

            const config = {
                method: 'POST',
                headers: {
                    Authorization: 'Basic ' + localStorage.token,
                    'Content-Type': 'application/json'
                },
                body
            }

            const response = await api.post('/transaction', config)

            const token = response.payment.token
            console.log(token)

            window.snap.pay(token, {
                onSuccess: function (result) {
                    console.log(result)
                    navigate('/profile')
                },
                onPending: function (result) {
                    console.log(result)
                    navigate('/profile')
                },
                onError: function (result) {
                    console.log(result)
                },
                onClose: function () {
                    alert('You close the popup without finishing the payment')
                }
            })

        } catch (error) {
            console.log(error)
        }
    })
    

  return (
    <div className='bg'>
        <NavBar title={title} />
        <div className='d-flex justify-content-center'>
            <div className='my-5 d-flex'>
                <div className='mx-5'>
                    <img src={product?.image} className='image_product' />
                </div>
                <div className='my-2' style={{width: '350px'}}>
                    <h2 className='red_font fw-bold'>{product?.name}</h2>
                    <div className='d-flex flex-column mt-4' style={{fontSize: '14px'}}>
                        <div className='mt-1'>
                            <p>Stock : {product?.qty}</p>
                        </div>
                        <div className='mt-3'>
                            <p className='text-break' style={{textAlign: 'justify'}}>{product?.desc}</p>
                        </div>
                        <div className='red_font ms-auto'>
                            <h5 style={{fontWeight: '700'}}>{convertRupiah.convert(product?.price)}</h5>
                        </div>
                        <div className='d-grid mt-3'>
                            <button onClick={() => buyProduct.mutate()}
                                style={{backgroundColor: '#F74D4D', color: 'white', fontSize: '16px'}} className='btn fw-bold'>
                                Buy
                            </button>
                        </div>
                    </div>
                        
                </div>
            </div>
        </div>
    </div>
  )
}
