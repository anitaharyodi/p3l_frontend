import {AiFillCloseCircle} from 'react-icons/ai'
import {BsList} from 'react-icons/bs'

export default function Navbar({ showSidebar, setShowSidebar }) {

    return (
        <nav className="bg-light-blue-500 md:ml-64 py-6 px-3">
            <div className="container max-w-full mx-auto flex items-center justify-between md:pr-8 md:pl-10">
                <div className="md:hidden">
                    <button
                    className='text-accent'
                        color="red"
                        onClick={() => setShowSidebar('left-0')}
                    >
                        <BsList className='text-2xl font-semibold mr-2 mt-2'/>
                    </button>
                    <div
                        className={`absolute top-2 md:hidden ${
                            showSidebar === 'left-0' ? 'left-64' : '-left-64'
                        } z-50 transition-all duration-300`}
                    >
                        <button
                            color="red"
                            className='text-accent'
                            onClick={() => setShowSidebar('-left-64')}
                        >
                            <AiFillCloseCircle className='text-2xl font-semibold ml-2'/>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
