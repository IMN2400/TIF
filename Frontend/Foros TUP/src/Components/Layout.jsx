import {Outlet} from 'react-router'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import { ToastContainer } from "react-toastify";

const Layout = () => {
    return <>
        <Header />
            <Outlet />
        <Footer />
        <ToastContainer
        position="top-center"
        autoClose={3000}
        pauseOnHover
        theme="colored"
    />
    </>
}


export default Layout