import React, { useContext } from 'react'
import NavBar from '../Components/NavBar'
import convertRupiah from 'rupiah-format'
import dateFormat from 'dateformat'

import imgBlank from '../Assets/blank-profile.png'
import { API } from '../Config/Api'
import { UserContext } from '../Context/User-Context'
import { useQuery } from 'react-query'

export default function Profile() {

  const title = 'Profile'
  document.title = 'DumbMerch | ' + title

  const api = API()
  const [state] = useContext(UserContext)

  let { data: profile, refetch: profileRefetch } = useQuery('profileCache', async () => {
    const config = {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + localStorage.token
      }
    }
    const response = await api.get('/profile', config)
    
    return response.data.data
  })

  let { data: transactions, refetch: transactionsRefetch } = useQuery('transactionsCache', async () => {
    const config = {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + localStorage.token
      }
    }
    const response = await api.get('/transactions', config)
    // console.log(response.data.data)
    return response.data.data
  })

  return (
    <div className='bg'>
      <NavBar title={title} />
      <div className='mx-5 d-flex justify-content-between my-4'>
        <div className='mt-4'>
          <h3 style={{color: '#F74D4D', fontWeight: '700'}}>My Profile</h3>
          <div className='mt-4 d-flex'>
            <img src={profile?.image ? profile.image : imgBlank} className='rounded' style={{width: '330px', height: '350px'}} />
            <div className='mx-4'>
              <div>
                <p className='text_profile'>Name</p>
                <p>{state.user.name}</p>
              </div>
              <div>
                <p className='text_profile'>Email</p>
                <p>{state.user.email}</p>
              </div>
              <div>
                <p className='text_profile'>Phone</p>
                <p>{profile?.phone ? profile?.phone : '-'}</p>
              </div>
              <div>
                <p className='text_profile'>Gender</p>
                <p>{profile?.gender ? profile?.gender : '-'}</p>
              </div>
              <div>
                <p className='text_profile'>Address</p>
                <p style={{width: '300px'}}>{profile?.address ? profile?.address : '-'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 d-flex flex-column'>
          <h3 style={{color: '#F74D4D', fontWeight: '700'}}>My Transaction</h3>
          
          <div className='d-flex flex-column'>
            <div className='transaction-list'>
            {transactions?.length != 0 ? (
              <>
                {transactions?.map((item, index) => (
                  <div key={index} className='d-flex transaction-card mt-4'>
                    <div className='mx-1'>
                      <img src={item.product.image} alt='' className='img-transaction' />
                    </div>
                    <div className='mx-2'>
                      <h6 className='red_font fw-bold mb-1'>{item.product.name}</h6>
                      <div>
                        <p className='red_font' style={{fontSize: '11px', fontWeight: 300}}>{dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}</p>
                        <p style={{fontSize: '12px'}} className='mb-3'>Price : {convertRupiah.convert(item.price)}</p>
                      </div>
                      <div>
                        <p className='fw-bold mb-0' style={{fontSize: '12px'}}>Sub Total : {convertRupiah.convert(item.price)}</p>
                      </div>
                    </div>
                    <div className='align-self-center ms-auto mx-3'>
                      <div
                        className={`status-transaction-${item.status} rounded h-100 d-flex align-items-center justify-content-center`}
                      >
                        {item.status}
                      </div> 
                    </div>        
                  </div>
                ))}
              </>
            ) : (
              <div className=''>No Transaction</div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
