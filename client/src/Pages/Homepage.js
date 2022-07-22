import React, { useEffect, useState } from 'react'
import ProductCard from '../Components/Card/Product-Card'
import NavBar from '../Components/NavBar'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import { API } from '../Config/Api'
import { useQuery } from 'react-query'

export default function Homepage() {

    const title = 'Product'
    document.title = 'DumbMerch | ' + title

    const [searchItem, setSearchItem] = useState('')

    const api = API()

    let { data: products, refetch } = useQuery('productCache', async () => {
        const config = {
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + localStorage.token
            }
        }

        let response = await api.get('/products', config)
        
        return response.data.product
    })

    const fil = () => {
        const data = products?.filter((item, index) => {
            if (searchItem == '') {
                <ProductCard item={item} key={item} />
            } else if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
                <ProductCard item={item} key={index} />
                console.log(item.name)
            }
        })
        return data
    }

  return (
    <div className='bg'>
        <NavBar title={title}  />
        <div className='mx-5 px-5 mt-5 pb-5'>
            <div className='search_bar'>
                <h3 style={{color: '#F74D4D', fontWeight: '700'}}>Product</h3>
                <div className='header_search'>
                    <input 
                        className='header_searchInput' 
                        type='text' 
                        style={{backgroundColor: '#353535', border: '1px solid #BCBCBC', color: 'white'}} 
                        onChange={(e) => setSearchItem(e.target.value)}
                        // onChange={handleFilter}
                        placeholder='Search...'  
                        value={searchItem}
                    />
                    {searchItem.length === 0 ? (
                        <SearchIcon 
                        className='header_searchIcon px-1' 
                        style={{fontSize: '35px'}}
                        />
                    ) : (
                        <CloseIcon
                        className='header_searchIcon px-1' 
                        style={{fontSize: '35px'}}
                        onClick={() => setSearchItem('')}
                        />
                    )}
                </div>
            </div>
            <div>
                <div className='d-flex mt-4 flex-wrap justify-content-around'>
                    <div className='d-flex flex-wrap justify-content-around'>
                        {products?.filter((item, index) => {
                            if (searchItem === '') {
                                return <ProductCard item={item} key={item} />
                            } else if (item.name.toLowerCase().includes(searchItem.toLowerCase())) {
                                return <ProductCard item={item} key={index} />
                            }
                        }).map((item, index) => (
                            <ProductCard item={item} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}