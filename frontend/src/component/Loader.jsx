import React from 'react'

function Loader() {
    return (
        <div className='w-full h-[100vh] flex justify-center items-center'>
            <div className='h-8 w-8 rounded-full border-4 border-solid border-y-gray-300 border-r-gray-300 border-l-blue-600 animate-spin'></div>
        </div>
    )
}

export default Loader