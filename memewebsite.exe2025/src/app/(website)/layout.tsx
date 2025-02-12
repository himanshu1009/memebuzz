"use client"
import withAuth from '@/components/withAuth'



const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>)=> {
    
    return (
        
        <div className='flex '>
            <div className='w-full h-full '>
                <div className=''>{children}</div>
            </div>
        </div>
    )
}


export default withAuth(Layout)