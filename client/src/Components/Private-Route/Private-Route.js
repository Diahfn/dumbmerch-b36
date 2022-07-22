import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { UserContext } from '../../Context/User-Context'

const PrivateRoute = () => {
    const isLogin = useContext(UserContext)

    return (
        isLogin ? <Outlet /> : <Navigate to='/auth' />
    )
}

export default PrivateRoute
